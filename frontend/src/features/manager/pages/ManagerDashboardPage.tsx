// EASY-TRACABILITY: frontend/src/features/manager/pages/ManagerDashboardPage.tsx

import React, { useState, useMemo } from "react";
import { KpiCard } from "../../../components/common/KpiCard";
import { MovementTable } from "../../../components/common/MovementTable";
import { DashboardCharts } from "../../admin/components/DashboardCharts";
import { useProducts } from "../../../hooks/useProduct";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import { useTransaction } from "../../../hooks/useTransaction";
import InputField from "../../../components/common/InputField";
import styles from "../../admin/styles/DashboardPage.module.css";
import { MovementLine } from "../../../types/inventoryMovement";

const ManagerDashboardPage: React.FC = () => {
  const { products } = useProducts();
  const { lines } = useInventoryMovements();
  const { transactions } = useTransaction();

  const [dateFilter, setDateFilter] = useState<
    "today" | "7days" | "30days" | "custom"
  >("today");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [opTypeFilter, setOpTypeFilter] = useState<"ALL" | "ACHAT" | "VENTE">(
    "ALL"
  );
  const [productFilter, setProductFilter] = useState<string>("");

  const now = new Date();
  let startDate = new Date();
  if (dateFilter === "7days") startDate.setDate(now.getDate() - 7);
  else if (dateFilter === "30days") startDate.setDate(now.getDate() - 30);
  else if (dateFilter === "custom" && customStart)
    startDate = new Date(customStart);
  const endDate =
    dateFilter === "custom" && customEnd ? new Date(customEnd) : now;

  const filteredMovements = useMemo(
    () =>
      (lines as MovementLine[]).filter((m) => {
        const d = new Date(m.createdAt);
        if (d < startDate || d > endDate) return false;
        if (productFilter) {
          const prod = products.find((p) => p.barcode === m.productBarcode);
          if (
            !prod ||
            !prod.name.toLowerCase().includes(productFilter.toLowerCase())
          )
            return false;
        }
        return true;
      }),
    [lines, startDate, endDate, productFilter, products]
  );

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((tx) => {
        const d = new Date(tx.createdAt);
        if (d < startDate || d > endDate) return false;
        if (opTypeFilter != "ALL" && tx.transactionType !== opTypeFilter)
          return false;
        if (productFilter) {
          const mv = lines.find((m) => m.uuid === tx.movementOrderUUID);
          const prod =
            mv && products.find((p) => p.barcode === mv.productBarcode);
          if (
            !prod ||
            !prod.name.toLowerCase().includes(productFilter.toLowerCase())
          )
            return false;
        }
        return true;
      }),
    [
      transactions,
      lines,
      startDate,
      endDate,
      opTypeFilter,
      productFilter,
      products,
    ]
  );

  const stockTotal = products.reduce(
    (sum, p) => sum + (p.stockQuantity || 0),
    0
  );
  const lowStockThreshold = 10;
  const lowStockCount = products.filter(
    (p) => (p.stockQuantity || 0) <= lowStockThreshold
  ).length;
  const mouvementsCount = filteredMovements.length;
  const transactionsCount = filteredTransactions.length;

  return (
    <div className={styles.dashboardContainer}>
      <h4>Dashboard Gestionnaire</h4>
      <div className={styles.filterRow}>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as any)}
        >
          <option value="today">Aujourd’hui</option>
          <option value="7days">7 derniers jours</option>
          <option value="30days">30 derniers jours</option>
          <option value="custom">Personnalisé</option>
        </select>
        {dateFilter === "custom" && (
          <>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </>
        )}
        <select
          value={opTypeFilter}
          onChange={(e) => setOpTypeFilter(e.target.value as any)}
        >
          <option value="ALL">Tous types</option>
          <option value="ACHAT">ACHAT</option>
          <option value="VENTE">VENTE</option>
        </select>
        <InputField
          placeholder="Produit"
          value={productFilter}
          onChange={setProductFilter}
        />
      </div>
      <div className={styles.kpiRow}>
        <KpiCard
          title="📦 Stock Total"
          value={stockTotal}
          iconLeft={<i className="dx-icon dx-icon-box" />}
        />
        <KpiCard
          title="🔻 Bas stock"
          value={lowStockCount}
          iconLeft={<i className="dx-icon dx-icon-warning" />}
        />
        <KpiCard
          title="🔁 Mouvements"
          value={mouvementsCount}
          iconLeft={<i className="dx-icon dx-icon-repeat" />}
        />
        <KpiCard
          title="🛒 Transactions"
          value={transactionsCount}
          iconLeft={<i className="dx-icon dx-icon-cart" />}
        />
      </div>
      <div className={styles.chartRow}>
        <DashboardCharts />
      </div>
      <MovementTable movements={filteredMovements} title="Mouvements filtrés" />
    </div>
  );
};

export default ManagerDashboardPage;
