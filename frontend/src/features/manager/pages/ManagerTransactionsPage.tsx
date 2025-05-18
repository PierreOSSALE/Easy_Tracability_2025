// EASY-TRACABILITY: frontend/src/features/manager/components/ManagerTransactionsPage.tsx

import { useState, useEffect, useMemo, useRef } from "react";
import { useTransaction } from "../../../hooks/useTransaction";
import { useProducts } from "../../../hooks/useProduct";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import DynamicTable from "../../../components/common/DynamicTable";
import Button from "devextreme-react/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SelectField from "../../../components/common/SelectField";
import "../../../index.css";

import { Transaction, TransactionType } from "../../../types/transaction";
import { InventoryMovement } from "../../../types/inventoryMovement";

function ManagerTransactionsPage() {
  const { transactions, loading, loadTransactions, downloadCSV } =
    useTransaction();
  const { products } = useProducts();
  const { movements } = useInventoryMovements();

  // Filters
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [productFilter, setProductFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Enrich transactions with product name
  const enriched = useMemo(() => {
    return transactions.map((tx) => {
      const mv = movements.find(
        (m: InventoryMovement) => m.uuid === tx.inventoryMovementUUID
      );
      const prod = mv
        ? products.find((p) => p.barcode === mv.productBarcode)
        : undefined;

      return { ...tx, productName: prod ? prod.name : "—" };
    });
  }, [transactions, movements, products]);

  // Product list from DB
  const productOptions = useMemo(() => products.map((p) => p.name), [products]);

  // Apply filters
  const filtered = useMemo(() => {
    return enriched.filter((tx) => {
      const d = new Date(tx.createdAt).toISOString().slice(0, 10);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      if (typeFilter && tx.transactionType !== typeFilter) return false;
      if (productFilter && tx.productName !== productFilter) return false;
      return true;
    });
  }, [enriched, dateFrom, dateTo, typeFilter, productFilter]);

  // Table columns
  const columns = [
    {
      header: "Type",
      accessor: "transactionType",
      render: (tx: any) =>
        tx.transactionType === TransactionType.ACHAT ? "ACHAT" : "VENTE",
    },
    {
      header: "Produit",
      accessor: "productName" as keyof Transaction & "productName",
    },
    {
      header: "Quantité",
      accessor: "quantity" as keyof Transaction & "quantity",
      render: (tx: any) => {
        const mv = movements.find(
          (m: InventoryMovement) => m.uuid === tx.inventoryMovementUUID
        );
        return mv?.quantity ?? "—";
      },
    },
    {
      header: "Montant total (€)",
      accessor: "totalPrice",
      render: (tx: any) => `${tx.totalPrice.toFixed(2)} €`,
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (tx: any) => new Date(tx.createdAt).toLocaleDateString(),
    },
  ];

  // Export PDF
  const handleExportPDF = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("transactions.pdf");
  };

  // Totaux pied de tableau
  const totalIn = useMemo(
    () =>
      filtered
        .filter((m) => m.transactionType === TransactionType.ACHAT)
        .reduce((sum, m) => sum + m.totalPrice, 0),
    [filtered]
  );

  const totalOut = useMemo(
    () =>
      filtered
        .filter((m) => m.transactionType === TransactionType.VENTE)
        .reduce((sum, m) => sum + m.totalPrice, 0),
    [filtered]
  );

  const footerData: Partial<Record<keyof InventoryMovement, React.ReactNode>> =
    {
      quantity: (
        <>
          ACHAT: <strong style={{ color: "green" }}>{totalIn}€</strong> — VENTE:{" "}
          <strong style={{ color: "red" }}>{totalOut}€</strong>
        </>
      ),
    };

  return (
    <div style={{ padding: 20 }}>
      <h4>Transactions (Achats / Ventes)</h4>
      {/* Filtres & actions */}
      <div className="FiltresActions">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <SelectField<string>
          value={productFilter}
          onChange={setProductFilter}
          options={productOptions}
          placeholder="Tous produits"
          className="SelectField"
        />
        <SelectField<string>
          value={typeFilter}
          onChange={setTypeFilter}
          options={[TransactionType.ACHAT, TransactionType.VENTE]}
          placeholder="Tous transaction"
          className="SelectField"
        />
        <Button
          icon="exportxlsx"
          text="Export CSV"
          onClick={downloadCSV}
          className="btn"
        />
        <Button
          icon="print"
          text="Export PDF"
          onClick={handleExportPDF}
          className="btn"
        />
      </div>

      {/* Tableau */}
      <div ref={tableRef}>
        {!loading ? (
          <DynamicTable<any>
            data={filtered}
            columns={columns}
            rowKey="uuid"
            footerData={footerData}
            showActions={false}
          />
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
}

export default ManagerTransactionsPage;
