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

const DashboardPage: React.FC = () => {
  const [lines, setLines] = useState<MovementLine[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      const [linesRes, productsRes, usersRes, lowStockRes] = await Promise.all([
        fetchRecentMovementLines(),
        getProductsInStock(),
        fetchUsers(),
        getProductsLowStock(100),
      ]);

      setLines(linesRes);
      setTotalProducts(productsRes.length);
      setTotalUsers(usersRes.length);
      setLowStockCount(lowStockRes.length);

      const today = new Date().toDateString();
      const todayLines = linesRes.filter(
        (l) => new Date(l.createdAt).toDateString() === today
      ).length;
      setTodayCount(todayLines);
    };
    loadData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h4>Dashboard</h4>
      <div className={styles.kpiRow}>
        <KpiCard
          title="Total Products"
          value={totalProducts}
          backgroundColor="#2B517A"
          iconLeft={<i className="dx-icon dx-icon-box" />}
        />
        <KpiCard
          title="Total Users"
          value={totalUsers}
          backgroundColor="#388E3C"
          iconLeft={<i className="dx-icon dx-icon-group" />}
        />
        <KpiCard
          title="Movements of the Day"
          value={todayCount}
          backgroundColor="#FFBA0F"
          iconLeft={<i className="dx-icon dx-icon-repeat" />}
        />
        <KpiCard
          title="Stock Alerts"
          value={lowStockCount}
          backgroundColor="#C62828"
          iconLeft={<i className="dx-icon dx-icon-warning" />}
        />
      </div>
      <div className={styles.chartRow}>
        <DashboardCharts />
      </div>
      <MovementTable movements={lines} />
    </div>
  );
};

export default DashboardPage;
