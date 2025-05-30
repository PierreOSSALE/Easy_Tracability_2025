// EASY-TRACABILITY: frontend/src/features/admin/pages/DashboardPage.tsx

import React, { useEffect, useState } from "react";
import { KpiCard } from "../../../components/common/KpiCard";
import { MovementTable } from "../../../components/common/MovementTable";
import { fetchRecentMovementLines } from "../../../services/InventoryMovement.service";
import { MovementLine } from "../../../types/inventoryMovement";
import {
  getProductsInStock,
  getProductsLowStock,
} from "../../../services/product.service";
import { fetchUsers } from "../../../features/admin/services/user.service";
import { DashboardCharts } from "../components/DashboardCharts";
import styles from "../styles/DashboardPage.module.css";

const LOW_STOCK_THRESHOLD = 100; // seuil configurable

const DashboardPage: React.FC = () => {
  const [lines, setLines] = useState<MovementLine[]>([]);
  const [inStockCount, setInStockCount] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [linesRes, stockRes, usersRes, lowStockRes] = await Promise.all([
          fetchRecentMovementLines(),
          getProductsInStock(),
          fetchUsers(),
          getProductsLowStock(LOW_STOCK_THRESHOLD),
        ]);

        setLines(linesRes);
        setInStockCount(stockRes.length);
        setTotalUsers(usersRes.length);
        setLowStockCount(lowStockRes.length);

        const today = new Date().toDateString();
        setTodayCount(
          linesRes.filter((l) => new Date(l.createdAt).toDateString() === today)
            .length
        );
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className={styles.loader}>Chargement du tableau de bord…</div>;
  }
  if (error) {
    return <div className={styles.error}>Erreur : {error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h4 className={styles.title}>Tableau de bord</h4>

      <div className={styles.kpiRow}>
        <KpiCard
          title="Produits en stock"
          value={inStockCount}
          backgroundColor="#2B517A"
          iconLeft={<i className="dx-icon dx-icon-box" />}
        />
        <KpiCard
          title="Utilisateurs actifs"
          value={totalUsers}
          backgroundColor="#388E3C"
          iconLeft={<i className="dx-icon dx-icon-group" />}
        />
        <KpiCard
          title="Mouvements du jour"
          value={todayCount}
          backgroundColor="#FFBA0F"
          iconLeft={<i className="dx-icon dx-icon-repeat" />}
        />
        <KpiCard
          title={`Alertes de stock (<${LOW_STOCK_THRESHOLD})`}
          value={lowStockCount}
          backgroundColor="#C62828"
          iconLeft={<i className="dx-icon dx-icon-warning" />}
        />
      </div>

      <div className={styles.chartRow}>
        <DashboardCharts />
      </div>

      <MovementTable
        movements={lines}
        title="Historique des mouvements d’inventaire"
      />
    </div>
  );
};

export default DashboardPage;
