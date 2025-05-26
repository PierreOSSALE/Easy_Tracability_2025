// EASY-TRACABILITY: frontend/src/features/operator/pages/OperatorDashboardPage.tsx

import React, { useState, useMemo } from "react";
import { useProducts } from "../../../hooks/useProduct";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import { useTransaction } from "../../../hooks/useTransaction";
import { useAuth } from "../../auth/hooks/useAuth";
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
import { MovementLine } from "../../../types/inventoryMovement";
import { Transaction } from "../../../types/transaction";

interface MovementLineWithUser extends MovementLine {
  order: { uuid: string; user: { uuid: string } };
}

type DateFilter = "today" | "7days" | "1month" | "3months" | "1year" | "custom";

const OperatorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { lines, loading: movLoading } = useInventoryMovements();
  const { transactions, loading: txLoading } = useTransaction();
  const loading = movLoading || txLoading;

  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  // Calculate date range based on filter
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
    default:
      startDate.setHours(0, 0, 0, 0);
  }
  if (dateFilter === "custom" && customStart) {
    startDate = new Date(customStart);
  }
  const endDate =
    dateFilter === "custom" && customEnd ? new Date(customEnd) : now;

  // Filter movements for this operator
  const myMovements = useMemo<MovementLineWithUser[]>(() => {
    if (!user) return [];
    return (lines as MovementLineWithUser[])
      .filter((m) => {
        const d = new Date(m.createdAt);
        return (
          d >= startDate && d <= endDate && m.order.user.uuid === user.uuid
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [lines, startDate, endDate, user?.uuid]);

  // Build order details map
  const orderDetails = useMemo(() => {
    const map = new Map<string, { products: string[]; totalQty: number }>();
    myMovements.forEach((m) => {
      const entry = map.get(m.order.uuid) || { products: [], totalQty: 0 };
      const name =
        products.find((p) => p.barcode === m.productBarcode)?.name || "—";
      entry.products.push(name);
      entry.totalQty += m.quantity;
      map.set(m.order.uuid, entry);
    });
    return map;
  }, [myMovements, products]);

  // Filter transactions for these orders
  const myTransactions = useMemo<Transaction[]>(() => {
    if (!user) return [];
    const orderUUIDs = new Set(myMovements.map((m) => m.order.uuid));
    return transactions
      .filter((t) => {
        const d = new Date(t.createdAt);
        return (
          d >= startDate && d <= endDate && orderUUIDs.has(t.movementOrderUUID)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [transactions, startDate, endDate, myMovements]);

  if (!user || loading) {
    return <p>Chargement des données…</p>;
  }

  const pieData = [
    { category: "Mouvements", value: myMovements.length },
    { category: "Transactions", value: myTransactions.length },
    {
      category: "Produits totaux",
      value: new Set(myMovements.map((m) => m.productBarcode)).size,
    },
  ];

  return (
    <div className={styles.container}>
      <h4>Tableau de bord Opérateur</h4>
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

      {/* Table des mouvements */}
      <h5>Derniers mouvements</h5>
      <DynamicTable<MovementLineWithUser>
        data={myMovements}
        columns={[
          {
            header: "Produit",
            accessor: "productBarcode" as const,
            render: (m) =>
              products.find((p) => p.barcode === m.productBarcode)?.name ?? "—",
          },
          { header: "Type", accessor: "operationType" as const },
          { header: "Quantité", accessor: "quantity" as const },
          {
            header: "Date/heure",
            accessor: "createdAt" as const,
            render: (m) => new Date(m.createdAt).toLocaleString("fr-FR"),
          },
        ]}
        rowKey="uuid"
        showActions={false}
      />

      <h5>Dernières transactions</h5>
      <DynamicTable<Transaction>
        data={myTransactions}
        columns={[
          { header: "Type", accessor: "transactionType" as const },
          {
            header: "Produits",
            accessor: "movementOrderUUID" as const,
            render: (t) => {
              const details = orderDetails.get(t.movementOrderUUID);
              if (!details) return "—";
              const names = details.products;
              if (names.length <= 3) return names.join(", ");
              return `${names.slice(0, 3).join(", ")} +${names.length - 3}`;
            },
          },
          {
            header: "Quantité totale",
            accessor: "movementOrderUUID" as const,
            render: (t) => orderDetails.get(t.movementOrderUUID)?.totalQty ?? 0,
          },
          {
            header: "Montant (€)",
            accessor: "totalPrice" as const,
            render: (t) => `${t.totalPrice.toFixed(2)} €`,
          },
          {
            header: "Date",
            accessor: "createdAt" as const,
            render: (t) => new Date(t.createdAt).toLocaleString("fr-FR"),
          },
        ]}
        rowKey="uuid"
        showActions={false}
      />
    </div>
  );
};

export default OperatorDashboardPage;
