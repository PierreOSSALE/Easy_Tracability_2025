// EASY-TRACABILITY: frontend/src/features/manager/components/ManagerStatisticsPage.tsx

import React from "react";
import { useStats } from "../../../hooks/useStats";
import { KpiCard } from "../../../components/common/KpiCard";
import PieChart, {
  Series as PieSeries,
  Label,
  Connector,
} from "devextreme-react/pie-chart";
import Button from "devextreme-react/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "../../admin/styles/DashboardCharts.module.css";

import "../../../index.css";
import { Title, Legend } from "devextreme-react/chart";

const ManagerStatisticsPage: React.FC = () => {
  const { stats, loading, error, refetch } = useStats();

  const exportPDF = async () => {
    const container = document.getElementById("stats-export");
    if (!container) return;
    const canvas = await html2canvas(container);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, width, height);
    pdf.save("manager_statistics.pdf");
  };

  if (loading) return <p>Chargement des statistiques...</p>;
  if (error || !stats)
    return <p>Erreur : {error || "Statistiques indisponibles"}</p>;

  const pieData = [
    { category: "Inventaire Entrant", value: stats.totalInventoryIn },
    { category: "Inventaire Sortant", value: stats.totalInventoryOut },
    { category: "Ventes", value: stats.totalSales },
    { category: "Achats", value: stats.totalPurchases },
  ];

  return (
    <div className={styles.statsContainer}>
      <h4 className={styles.statsTitle}>📊 Statistiques Générales</h4>
      <div className={styles.statsActions}>
        <Button icon="refresh" text="Rafraîchir" onClick={refetch} />
        <Button icon="print" text="Exporter PDF" onClick={exportPDF} />
      </div>

      <div
        className={styles.kpiRow}
        style={{
          margin: "25px 0",
          display: "flex",
          columnGap: "100px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <KpiCard
          title="Produits totaux"
          value={stats.totalProducts}
          iconLeft={<i className="dx-icon dx-icon-box" />}
          backgroundColor="var(--color-primary)"
        />
        <KpiCard
          title="Transactions"
          value={stats.totalTransactions}
          iconLeft={<i className="dx-icon dx-icon-cart" />}
          backgroundColor="var(--color-error)"
        />
      </div>

      <div id="stats-export" className={styles.chartGrid}>
        <div className={styles.chartBox} style={{ margin: "50px " }}>
          <Title text="Répartition Inventaires & Transactions" />
          <PieChart
            dataSource={pieData}
            palette={[
              "var(--color-primary)",
              "var(--color-yellow)",
              "var(--color-error)",
              "var(--color-success)",
            ]}
            innerRadius={0.5}
          >
            <PieSeries argumentField="category" valueField="value">
              <Label visible>
                <Connector visible width={1} />
              </Label>
            </PieSeries>
            <Legend verticalAlignment="bottom" horizontalAlignment="center" />
          </PieChart>
        </div>
        {/* <div className={styles.chartBox} style={{ margin: "50px " }}>
          <Title text="Détail par Catégorie" />
          <PieChart
            dataSource={pieData}
            palette={[
              "var(--color-primary)",
              "var(--color-yellow)",
              "var(--color-error)",
              "var(--color-success)",
            ]}
          >
            <PieSeries argumentField="category" valueField="value">
              <Label visible>
                <Connector visible width={1} />
              </Label>
            </PieSeries>
            <Legend verticalAlignment="bottom" horizontalAlignment="center" />
          </PieChart>
        </div> */}
      </div>
    </div>
  );
};

export default ManagerStatisticsPage;
