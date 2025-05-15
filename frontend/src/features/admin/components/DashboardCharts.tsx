// EASY-TRACABILITY:frontend/src/features/admin/components/DashboardCharts.tsx

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
import { fetchInventoryMovements } from "../../../services/InventoryMovement.service";
import { fetchUsers } from "../services/user.service";
import { InventoryMovement } from "../../../types/inventoryMovement";
import { User, UserRole } from "../../../types/user";
import styles from "../styles/DashboardCharts.module.css";
import html2canvas from "html2canvas/dist/html2canvas.esm.js";
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
      const [movementRes, users] = await Promise.all([
        fetchInventoryMovements(),
        fetchUsers(),
      ]);

      const filtered = movementRes.rows.filter((m: InventoryMovement) => {
        const date =
          typeof m.date === "string"
            ? (m.date as string).slice(0, 10)
            : new Date(m.date as Date).toISOString().slice(0, 10);
        return date >= startDate && date <= endDate;
      });

      const groupByDate: Record<string, { ENTREE: number; SORTIE: number }> =
        {};
      filtered.forEach((m: InventoryMovement) => {
        const date = new Date(m.date).toLocaleDateString();
        if (!groupByDate[date]) groupByDate[date] = { ENTREE: 0, SORTIE: 0 };
        groupByDate[date][m.operationType]++;
      });

      const movementArr = Object.entries(groupByDate).map(([date, values]) => ({
        date,
        ...values,
      }));
      setMovementData(movementArr);

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
      {/* Filtres */}
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

      {/* Contenu exportable */}
      <div className={styles.container} ref={exportRef}>
        {/* Line Chart */}
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
              color="var(--color-success)"
            />
            <Series
              valueField="SORTIE"
              argumentField="date"
              name="Sorties"
              type="line"
              color="var(--color-error)"
            />
            <DxTooltip enabled />
            <Export enabled={false} />
          </Chart>
        </div>

        {/* Pie Chart */}
        <div className={styles.chartBox}>
          <PieChart
            dataSource={userRoleData}
            title="Répartition des rôles utilisateurs"
            palette={[
              "var(--color-primary)", // 1er secteur
              "var(--color-success)", // 2e secteur
              "var(--color-error)", // 3e secteur
            ]}
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
