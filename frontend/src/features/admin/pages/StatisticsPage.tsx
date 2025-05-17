// EASY-TRACABILITY:frontend/src/features/admin/pages/StatisticsPage.tsx

import { useEffect, useRef, useState } from "react";
import {
  Chart,
  Series,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
  Title,
  Export,
  Legend,
} from "devextreme-react/chart";
import PieChart, {
  Series as PieSeries,
  Label,
  Connector,
} from "devextreme-react/pie-chart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "../styles/DashboardCharts.module.css";

import {
  fetchInventoryMovements,
  exportInventoryMovementsCSV,
} from "../../../services/InventoryMovement.service";
import { fetchAllProducts } from "../../../services/product.service";

interface ProductMovementCount {
  name: string;
  count: number;
}

interface OperationTypeCount {
  type: string;
  count: number;
}

export default function StatisticsPage() {
  const [topProducts, setTopProducts] = useState<ProductMovementCount[]>([]);
  const [operationCounts, setOperationCounts] = useState<OperationTypeCount[]>(
    []
  );

  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStats = async () => {
      const [movementsRes, products] = await Promise.all([
        fetchInventoryMovements(),
        fetchAllProducts(),
      ]);

      const filteredMovements = movementsRes.rows.filter((m: any) => {
        const date = new Date(m.date).toISOString().slice(0, 10);
        return date >= startDate && date <= endDate;
      });

      // 🔺 Top 5 Produits
      const productMap: Record<string, number> = {};
      filteredMovements.forEach((m: any) => {
        productMap[m.productUUID] = (productMap[m.productUUID] || 0) + 1;
      });

      const top5 = Object.entries(productMap)
        .map(([uuid, count]) => {
          const product = products.find((p: any) => p.uuid === uuid);
          return { name: product?.name || "Inconnu", count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setTopProducts(top5);

      // 📦 Répartition des types d’opérations
      const operationStats: Record<string, number> = {};
      filteredMovements.forEach((m: any) => {
        operationStats[m.operationType] =
          (operationStats[m.operationType] || 0) + 1;
      });

      const pieData = Object.entries(operationStats).map(([type, count]) => ({
        type,
        count,
      }));

      setOperationCounts(pieData);
    };

    loadStats();
  }, [startDate, endDate]);

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("statistics.pdf");
  };

  const handleExportCSV = async () => {
    await exportInventoryMovementsCSV();
  };

  return (
    <div style={{ margin: "20px" }}>
      <h4>
        📈 Statistiques <i className="fa-solid fa-angles-right"></i>
      </h4>

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
          📄 Exporter PDF
        </button>
        <button className={styles.exportBtn} onClick={handleExportCSV}>
          📤 Exporter CSV
        </button>
      </div>

      <div className={styles.container} ref={exportRef}>
        {/* 🔺 TOP 5 PRODUITS */}
        <div className={styles.chartBox}>
          <Chart dataSource={topProducts}>
            <Title text="🔺 Top 5 Produits par Mouvements" />
            <ArgumentAxis title="Produit" />
            <ValueAxis title="Nombre de mouvements" />
            <Series
              valueField="count"
              argumentField="name"
              type="bar"
              name="Mouvements"
              color="var(--color-primary)"
            />
            <Tooltip enabled />
            <Legend visible={false} />
            <Export enabled={false} />
          </Chart>
        </div>

        {/* 📦 RÉPARTITION TYPE OPÉRATIONS */}
        <div className={styles.chartBox}>
          <PieChart
            dataSource={operationCounts}
            palette={["#c62828", "#388e3c", "#ffc107", "#2196f3"]}
            title="📦 Répartition des types d’opérations"
          >
            <PieSeries argumentField="type" valueField="count">
              <Label visible>
                <Connector visible width={1} />
              </Label>
            </PieSeries>
            <Legend verticalAlignment="bottom" horizontalAlignment="center" />
            <Tooltip enabled />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
