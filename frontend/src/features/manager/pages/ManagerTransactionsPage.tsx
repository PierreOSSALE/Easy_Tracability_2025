// EASY-TRACABILITY: frontend/src/features/manager/components/ManagerTransactionsPage.tsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTransaction } from "../../../hooks/useTransaction";
import { useProducts } from "../../../hooks/useProduct";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import DynamicTable from "../../../components/common/DynamicTable";
import Button from "devextreme-react/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SelectField from "../../../components/common/SelectField";

import { Transaction, TransactionType } from "../../../types/transaction";
import { MovementLine } from "../../../types/inventoryMovement";

const ManagerTransactionsPage: React.FC = () => {
  const { transactions, loading, loadTransactions, downloadCSV } =
    useTransaction();
  const { products } = useProducts();
  const { lines } = useInventoryMovements();

  // Filters
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [productFilter, setProductFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "">("");

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Enrich transactions with productName and quantity
  const enriched = useMemo(() => {
    return transactions.map((tx) => {
      const movUUID = tx.movementOrderUUID;
      // match on the movementOrderUUID field of each movement line
      const mv = lines.find(
        (m: MovementLine) => m.movementOrderUUID === movUUID
      );
      const productName = mv
        ? (products.find((p) => p.barcode === mv.productBarcode)?.name ?? "—")
        : "—";
      const quantity = mv ? mv.quantity : 0;
      return { ...tx, productName, quantity };
    });
  }, [transactions, lines, products]);

  const productOptions = useMemo(() => products.map((p) => p.name), [products]);

  // Apply filters
  const filtered = useMemo(() => {
    return enriched.filter((tx) => {
      const isoDate = new Date(tx.createdAt).toISOString().slice(0, 10);
      if (dateFrom && isoDate < dateFrom) return false;
      if (dateTo && isoDate > dateTo) return false;
      if (typeFilter && tx.transactionType !== typeFilter) return false;
      if (productFilter && tx.productName !== productFilter) return false;
      return true;
    });
  }, [enriched, dateFrom, dateTo, typeFilter, productFilter]);

  // Define table columns
  const columns = [
    {
      header: "Type",
      accessor: "transactionType" as const,
      render: (tx: Transaction) => tx.transactionType,
    },
    { header: "Produit", accessor: "productName" as const },
    { header: "Quantité", accessor: "quantity" as const },
    {
      header: "Montant total (€)",
      accessor: "totalPrice" as const,
      render: (tx: Transaction) => `${tx.totalPrice.toFixed(2)} €`,
    },
    {
      header: "Date",
      accessor: "createdAt" as const,
      render: (tx: Transaction) => new Date(tx.createdAt).toLocaleDateString(),
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

  return (
    <div style={{ padding: 20 }}>
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
        <SelectField
          value={productFilter}
          onChange={setProductFilter}
          options={productOptions}
          placeholder="Tous produits"
        />
        <SelectField
          value={typeFilter}
          onChange={setTypeFilter}
          options={[TransactionType.ACHAT, TransactionType.VENTE]}
          placeholder="Type de transaction"
        />
        <Button icon="exportxlsx" text="Export CSV" onClick={downloadCSV} />
        <Button icon="print" text="Export PDF" onClick={handleExportPDF} />
      </div>
      <div ref={tableRef}>
        {!loading ? (
          <DynamicTable<any>
            data={filtered}
            columns={columns}
            rowKey="uuid"
            showActions={false}
          />
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
};

export default ManagerTransactionsPage;
