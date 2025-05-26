// EASY-TRACABILITY: frontend/src/features/admin/components/DashboardCharts.tsx

import { useEffect, useRef, useState } from "react";
import {
  Chart,
  Series,
  ArgumentAxis,
  ValueAxis,
  Legend,
  Export,
  Tooltip as DxTooltip,
  Title,
} from "devextreme-react/chart";
import PieChart, {
  Series as PieSeries,
  Label,
  Connector,
} from "devextreme-react/pie-chart";
import { fetchMovementLines } from "../../../services/InventoryMovement.service";
import { fetchUsers } from "../services/user.service";
import { MovementLine, OperationType } from "../../../types/inventoryMovement";
import { User, UserRole } from "../types/user";
import styles from "../styles/DashboardCharts.module.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface MovementChartData {
  date: string;
  ENTREE: number;
  SORTIE: number;
}

export const DashboardCharts = () => {
  const [movementData, setMovementData] = useState<MovementChartData[]>([]);
  const [userRoleData, setUserRoleData] = useState<
    { role: string; count: number }[]
  >([]);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const exportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("dashboard_charts.pdf");
  };

  useEffect(() => {
    const loadData = async () => {
      const [movRes, users] = await Promise.all([
        fetchMovementLines(),
        fetchUsers(),
      ]);

      // filter by createdAt
      const filtered = movRes.rows.filter((m: MovementLine) => {
        const d = m.createdAt.slice(0, 10);
        return d >= startDate && d <= endDate;
      });

      // group by date / operation
      const groupByDate: Record<string, Record<OperationType, number>> = {};
      filtered.forEach((m) => {
        const day = new Date(m.createdAt).toLocaleDateString();
        if (!groupByDate[day]) {
          groupByDate[day] = {
            [OperationType.ENTREE]: 0,
            [OperationType.SORTIE]: 0,
          };
        }
        groupByDate[day][m.operationType]++;
      });

      const movementArr: MovementChartData[] = Object.entries(groupByDate).map(
        ([date, values]) => ({ date, ...values })
      );
      setMovementData(movementArr);

      // user roles pie
      const roleCounts: Record<UserRole, number> = {
        [UserRole.ADMIN]: 0,
        [UserRole.MANAGER]: 0,
        [UserRole.OPERATOR]: 0,
      };
      users.forEach((u: User) => roleCounts[u.role]++);
      setUserRoleData([
        { role: "Administrateur", count: roleCounts[UserRole.ADMIN] },
        { role: "Gestionnaire", count: roleCounts[UserRole.MANAGER] },
        { role: "Opérateur", count: roleCounts[UserRole.OPERATOR] },
      ]);
    };

    loadData();
  }, [startDate, endDate]);

  return (
    <div>
      <div className={styles.controls}>
        <label>
          Début :
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Fin :
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button className={styles.exportBtn} onClick={handleExportPDF}>
          📤 Exporter PDF
        </button>
      </div>

      <div className={styles.container} ref={exportRef}>
        <div className={styles.chartBox}>
          <Chart dataSource={movementData}>
            <Title text="Évolution quotidienne des mouvements" />
            <ArgumentAxis title="Date" />
            <ValueAxis title="Nombre de mouvements" />
            <Legend verticalAlignment="top" horizontalAlignment="right" />
            <Series
              valueField="ENTREE"
              argumentField="date"
              name="Entrées"
              type="line"
            />
            <Series
              valueField="SORTIE"
              argumentField="date"
              name="Sorties"
              type="line"
            />
            <DxTooltip enabled />
            <Export enabled={false} />
          </Chart>
        </div>

        <div className={styles.chartBox}>
          <PieChart
            dataSource={userRoleData}
            title="Répartition des rôles utilisateurs"
          >
            <PieSeries argumentField="role" valueField="count">
              <Label visible>
                <Connector visible width={1} />
              </Label>
            </PieSeries>
            <Legend verticalAlignment="bottom" horizontalAlignment="center" />
            <DxTooltip enabled />
          </PieChart>
        </div>
      </div>
    </div>
  );
};
