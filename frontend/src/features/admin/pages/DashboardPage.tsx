// EASY-TRACABILITY:frontend/src/features/admin/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import { KpiCard } from "../../../components/common/KpiCard";
import { MovementTable } from "../../../components/common/MovementTable";
import { fetchRecentInventoryMovements } from "../../../services/InventoryMovement.service";
import { InventoryMovement } from "../../../types/inventoryMovement";
import {
  getProductsInStock,
  getProductsLowStock,
} from "../../../services/product.service";
import { fetchUsers } from "../../../features/admin/services/user.service";
import { DashboardCharts } from "../components/DashboardCharts";
import styles from "../styles/DashboardPage.module.css";
const DashboardPage = () => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [todayMovements, setTodayMovements] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const [mvtRes, prodRes, usersRes, lowStockRes] = await Promise.all([
        fetchRecentInventoryMovements(),
        getProductsInStock(),
        fetchUsers(),
        getProductsLowStock(100),
      ]);

      setMovements(mvtRes);
      setTotalProducts(prodRes.length);
      setTotalUsers(usersRes.length);
      setLowStockCount(lowStockRes.length);

      const today = new Date().toDateString();
      const todayCount = mvtRes.filter(
        (m) => new Date(m.date).toDateString() === today
      ).length;
      setTodayMovements(todayCount);
    };

    loadData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h4>Dashboard</h4>

      {/* Bloc KPI avec icônes et couleurs */}
      <div className={styles.kpiRow}>
        <KpiCard
          title="Total Products"
          value={totalProducts}
          backgroundColor="#2B517A"
          iconLeft={<i className="dx-icon dx-icon-box" />}
          iconRight={<i className="dx-icon dx-icon-money" />}
        />
        <KpiCard
          title="Total Users"
          value={totalUsers}
          backgroundColor="#388E3C"
          iconLeft={<i className="dx-icon dx-icon-group" />}
          iconRight={<i className="dx-icon dx-icon-money" />}
        />
        <KpiCard
          title="Movements of the Day"
          value={todayMovements}
          backgroundColor="#FFBA0F"
          iconLeft={<i className="dx-icon dx-icon-repeat" />}
          iconRight={<i className="dx-icon dx-icon-money" />}
        />
        <KpiCard
          title="Stock Alerts"
          value={lowStockCount}
          backgroundColor="#C62828"
          iconLeft={<i className="dx-icon dx-icon-warning" />}
          iconRight={<i className="dx-icon dx-icon-money" />}
        />
      </div>

      {/* Charts */}
      <div className={styles.chartRow}>
        <DashboardCharts />
      </div>

      {/* Tableau */}
      <MovementTable movements={movements} />
    </div>
  );
};

export default DashboardPage;
