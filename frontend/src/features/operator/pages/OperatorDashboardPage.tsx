// EASY-TRACABILITY: frontend/src/features/operateur/pages/OperatorDashboardPage.tsx

import React, { useState, useMemo } from "react";
import { useProducts } from "../../../hooks/useProduct";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import { useTransaction } from "../../../hooks/useTransaction";
import DynamicTable from "../../../components/common/DynamicTable";
import {
  PieChart,
  Series as PieSeries,
  Title as PieTitle,
  Label,
  Connector,
  Legend,
} from "devextreme-react/pie-chart";
import styles from "../../admin/styles/DashboardCharts.module.css";

import "../../../index.css";
import { InventoryMovement } from "../../../types/inventoryMovement";
type DateFilter = "today" | "7days" | "1month" | "3months" | "1year" | "custom";
const OperatorDashboardPage: React.FC = () => {
  const { products } = useProducts();
  const { movements, loading: movLoading } = useInventoryMovements();
  const { transactions, loading: txLoading } = useTransaction();

  const loading = movLoading || txLoading;
  // date filter
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  const now = new Date();
  let startDate = new Date();
  switch (dateFilter) {
    case "7days":
      startDate.setDate(now.getDate() - 7);
      break;
    case "1month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "3months":
      startDate.setMonth(now.getMonth() - 3);
      break;
    case "1year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case "today":
    default:
      startDate.setHours(0, 0, 0, 0);
  }
  if (dateFilter === "custom" && customStart) {
    startDate = new Date(customStart);
  }
  const endDate =
    dateFilter === "custom" && customEnd ? new Date(customEnd) : now;

  // filter movements
  const myMovements = useMemo(
    () =>
      movements
        .filter((m) => {
          const d = new Date(m.date);
          return d >= startDate && d <= endDate;
        })
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [movements, startDate, endDate]
  );

  // filter transactions
  const myTransactions = useMemo(
    () =>
      transactions
        .filter((t) => {
          const d = new Date(t.createdAt);
          return d >= startDate && d <= endDate;
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [transactions, startDate, endDate]
  );

  if (loading) {
    return <p>Chargement des données…</p>;
  }

  const pieData = [
    { category: "Mouvements", value: myMovements.length },
    { category: "Transactions", value: myTransactions.length },
    { category: "Produits totaux", value: products.length },
  ];

  return (
    <div className={styles.container}>
      <h4>Tableau de bord Opérateur</h4>

      {/* filtres date */}
      <div className={styles.filterRow}>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
        >
          <option value="today">Aujourd’hui</option>
          <option value="7days">7 jours</option>
          <option value="1month">1 mois</option>
          <option value="3months">3 mois</option>
          <option value="1year">1 an</option>
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
      </div>

      {/* graphique camembert */}
      <div className={styles.chartBox}>
        <PieTitle text="Vos activités" />
        <PieChart dataSource={pieData} innerRadius={0.5}>
          <PieSeries argumentField="category" valueField="value">
            <Label visible>
              <Connector visible width={1} />
            </Label>
          </PieSeries>
          <Legend verticalAlignment="bottom" horizontalAlignment="center" />
        </PieChart>
      </div>

      {/* tableaux */}
      <h5>Derniers mouvements</h5>
      <DynamicTable<InventoryMovement>
        data={myMovements}
        columns={[
          {
            header: "Produit",
            accessor: "productBarcode" as const,
            render: (m) => {
              const prod = products.find((p) => p.barcode === m.productBarcode);
              return prod?.name ?? "—";
            },
          },
          { header: "Type", accessor: "operationType" as const },
          { header: "Quantité", accessor: "quantity" as const },
          {
            header: "Date/heure",
            accessor: "date" as const,
            render: (m) => new Date(m.date).toLocaleString("fr-FR"),
          },
        ]}
        rowKey="uuid"
        showActions={false}
      />

      <h5>Dernières transactions</h5>
      <DynamicTable<any>
        data={myTransactions}
        columns={[
          { header: "Type", accessor: "transactionType" as const },
          {
            header: "Produit",
            accessor: "inventoryMovementUUID", // juste pour typer, pas de lookup direct
            render: (tx: any) => {
              const mv = movements.find(
                (m) => m.uuid === tx.inventoryMovementUUID
              );
              const prod =
                mv && products.find((p) => p.barcode === mv.productBarcode);
              return prod?.name ?? "—";
            },
          },
          {
            header: "Quantité",
            accessor: "quantity" as const,
            render: (t: any) => {
              const mv = movements.find(
                (m) => m.uuid === t.inventoryMovementUUID
              );
              return mv?.quantity ?? "—";
            },
          },
          {
            header: "Montant (€)",
            accessor: "totalPrice" as const,
            render: (t: any) => `${t.totalPrice.toFixed(2)} €`,
          },
          {
            header: "Date",
            accessor: "createdAt" as const,
            render: (t: any) => new Date(t.createdAt).toLocaleString("fr-FR"),
          },
        ]}
        rowKey="uuid"
        showActions={false}
      />
    </div>
  );
};

export default OperatorDashboardPage;
