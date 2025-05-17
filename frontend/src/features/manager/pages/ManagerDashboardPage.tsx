// EASY-TRACABILITY: frontend/src/features/manager/components/ManagerDashboardPage.tsx

import React, { useState } from "react";
import { KpiCard } from "../../../components/common/KpiCard";
import { MovementTable } from "../../../components/common/MovementTable";
import { DashboardCharts } from "../../admin/components/DashboardCharts";

import { useProducts } from "../../../hooks/useProduct";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import { useTransaction } from "../../../hooks/useTransaction";
import InputField from "../../../components/common/InputField";

import styles from "../../admin/styles/DashboardPage.module.css"; // ✅ Réutilise les styles admin

const ManagerDashboardPage: React.FC = () => {
  const { products } = useProducts();
  const { movements } = useInventoryMovements();
  const { transactions } = useTransaction();

  // 🔍 Filtres rapides
  const [dateFilter, setDateFilter] = useState<
    "today" | "7days" | "30days" | "custom"
  >("today");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [opTypeFilter, setOpTypeFilter] = useState<"ALL" | "VENTE" | "ACHAT">(
    "ALL"
  );
  const [productFilter, setProductFilter] = useState<string>("");

  // 📅 Dates limites
  const now = new Date();
  let startDate = new Date();
  if (dateFilter === "7days") startDate.setDate(now.getDate() - 7);
  else if (dateFilter === "30days") startDate.setDate(now.getDate() - 30);
  else if (dateFilter === "custom" && customStart)
    startDate = new Date(customStart);
  const endDate =
    dateFilter === "custom" && customEnd ? new Date(customEnd) : now;

  const filteredMovements = movements.filter((m) => {
    const d = new Date(m.date);
    if (d < startDate || d > endDate) return false;
    if (productFilter) {
      const prod = products.find((p) => p.uuid === m.productUUID);
      if (
        !prod ||
        !prod.name.toLowerCase().includes(productFilter.toLowerCase())
      )
        return false;
    }
    return true;
  });

  const filteredTransactions = transactions.filter((tx) => {
    const d = new Date(tx.createdAt);
    if (d < startDate || d > endDate) return false;
    if (opTypeFilter !== "ALL" && tx.transactionType !== opTypeFilter)
      return false;
    if (productFilter) {
      const mv = movements.find((m) => m.uuid === tx.inventoryMovementUUID);
      const prodUUID = mv?.productUUID;
      const prod = products.find((p) => p.uuid === prodUUID);
      if (
        !prod ||
        !prod.name.toLowerCase().includes(productFilter.toLowerCase())
      )
        return false;
    }
    return true;
  });

  // 📊 KPI Calculs
  const stockTotal = products.reduce(
    (sum, p) => sum + (p.stockQuantity || 0),
    0
  );
  const lowStockThreshold = 10;
  const produitsFaibles = products.filter(
    (p) => (p.stockQuantity ?? 0) <= lowStockThreshold
  ).length;
  const mouvementsAujourdhui = filteredMovements.length;
  const transactionsAujourdhui = filteredTransactions.length;

  return (
    <div className={styles.dashboardContainer}>
      <h4>Dashboard Gestionnaire</h4>

      {/* 🎯 Filtres dynamiques */}
      <div className={styles.filterRow}>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as any)}
          className="select"
        >
          <option value="today">Aujourd’hui</option>
          <option value="7days">7 derniers jours</option>
          <option value="30days">30 derniers jours</option>
          <option value="custom">Plage personnalisée</option>
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
          className="select"
        >
          <option value="ALL">Tous types</option>
          <option value="ACHAT">ENTREE</option>
          <option value="VENTE">SORTIE</option>
        </select>

        <InputField
          placeholder="Produit (name)"
          value={productFilter}
          onChange={setProductFilter}
          className="select"
        />
      </div>

      {/* ✅ Cartes KPI personnalisées */}
      <div className={styles.kpiRow}>
        <KpiCard
          title="📦 Stock Total"
          value={stockTotal}
          iconLeft={<i className="dx-icon dx-icon-box" />}
          backgroundColor="#2B517A"
        />
        <KpiCard
          title="🔻 Produits Faibles"
          value={produitsFaibles}
          iconLeft={<i className="dx-icon dx-icon-warning" />}
          backgroundColor="#C62828"
        />
        <KpiCard
          title="🔁 Mouvements"
          value={mouvementsAujourdhui}
          iconLeft={<i className="dx-icon dx-icon-repeat" />}
          backgroundColor="#FFBA0F"
        />
        <KpiCard
          title="🛒 Transactions"
          value={transactionsAujourdhui}
          iconLeft={<i className="dx-icon dx-icon-cart" />}
          backgroundColor="#388E3C"
        />
      </div>

      {/* 📈 Graphiques */}
      <div className={styles.chartRow}>
        <DashboardCharts />
      </div>

      {/* 📋 Tableau des mouvements */}
      <MovementTable movements={filteredMovements} />
    </div>
  );
};

export default ManagerDashboardPage;
