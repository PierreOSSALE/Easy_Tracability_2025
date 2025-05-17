// EASY-TRACABILITY: frontend/src/features/manager/pages/ManagerMovementsPage.tsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import DynamicTable from "../../../components/common/DynamicTable";
import Button from "devextreme-react/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import AddButtonWithModal from "../../../components/common/AddButtonWithModal";
import InputField from "../../../components/common/InputField";
import InputNumberField from "../../../components/common/InputNumberField";
import SelectField from "../../../components/common/SelectField";
import styles from "../../admin/styles/DashboardCharts.module.css";

import {
  InventoryMovement,
  OperationType,
} from "../../../types/inventoryMovement";
import {
  Chart,
  Series,
  ArgumentAxis,
  ValueAxis,
  Legend,
  Export,
  Tooltip,
  Title,
} from "devextreme-react/chart";

function ManagerMovementsPage() {
  const {
    movements,
    loading,
    error,
    loadAllMovements,
    exportCSV,
    addMovement,
  } = useInventoryMovements();

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [productFilter, setProductFilter] = useState<string>("");
  const [operatorFilter, setOperatorFilter] = useState<string>("");

  const [newMovement, setNewMovement] = useState<Partial<InventoryMovement>>({
    productUUID: "",
    userUUID: "",
    date: new Date(),
    operationType: OperationType.ENTREE,
    quantity: undefined,
  });

  useEffect(() => {
    loadAllMovements();
  }, [loadAllMovements]);

  // Filtrage des données
  const filtered = useMemo<InventoryMovement[]>(() => {
    return movements
      .filter((m) => {
        const d = new Date(m.date).toISOString().slice(0, 10);
        if (dateFrom && d < dateFrom) return false;
        if (dateTo && d > dateTo) return false;
        return true;
      })
      .filter((m) =>
        productFilter ? m.productUUID.includes(productFilter) : true
      )
      .filter((m) =>
        operatorFilter ? m.userUUID.includes(operatorFilter) : true
      );
  }, [movements, dateFrom, dateTo, productFilter, operatorFilter]);

  // Graph data
  const chartData = useMemo(() => {
    const grouped: Record<string, { ENTREE: number; SORTIE: number }> = {};
    filtered.forEach((m) => {
      const day = new Date(m.date).toLocaleDateString();
      if (!grouped[day]) grouped[day] = { ENTREE: 0, SORTIE: 0 };
      grouped[day][m.operationType]++;
    });
    return Object.entries(grouped).map(([date, vals]) => ({ date, ...vals }));
  }, [filtered]);

  // Totaux pied de tableau
  const totalIn = useMemo(
    () =>
      filtered
        .filter((m) => m.operationType === OperationType.ENTREE)
        .reduce((sum, m) => sum + m.quantity, 0),
    [filtered]
  );
  const totalOut = useMemo(
    () =>
      filtered
        .filter((m) => m.operationType === OperationType.SORTIE)
        .reduce((sum, m) => sum + m.quantity, 0),
    [filtered]
  );

  const footerData: Partial<Record<keyof InventoryMovement, React.ReactNode>> =
    {
      quantity: (
        <>
          Entrées: <strong style={{ color: "green" }}>{totalIn}</strong> —
          Sorties: <strong style={{ color: "red" }}>{totalOut}</strong>
        </>
      ),
    };

  // Déclaration explicite de tableColumns
  const tableColumns: {
    header: string;
    accessor: keyof InventoryMovement;
    render?: (item: InventoryMovement) => React.ReactNode;
  }[] = [
    {
      header: "Date",
      accessor: "date",
      render: (m: InventoryMovement) => new Date(m.date).toLocaleDateString(),
    },
    { header: "Produit", accessor: "productUUID" },
    { header: "Opérateur", accessor: "userUUID" },
    {
      header: "Type",
      accessor: "operationType",
      render: (m: InventoryMovement) =>
        m.operationType === OperationType.ENTREE ? "ENTRÉE" : "SORTIE",
    },
    { header: "Quantité", accessor: "quantity" },
  ];

  const tableRef = useRef<HTMLDivElement>(null);
  const handleExportPDF = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("mouvements_stock.pdf");
  };
  const handleSync = () => loadAllMovements();

  return (
    <div style={{ padding: 20 }}>
      <h4>Mouvements de Stock</h4>

      {/* Filtres & actions */}
      <div style={{ marginBottom: 16 }}>
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
        <input
          placeholder="Produit"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        />
        <input
          placeholder="Opérateur"
          value={operatorFilter}
          onChange={(e) => setOperatorFilter(e.target.value)}
        />
        <Button icon="filter" text="Filtrer" onClick={() => {}} />
        <Button icon="refresh" text="Synchroniser" onClick={handleSync} />
        <Button
          icon="exportxlsx"
          text="Export CSV"
          onClick={async () => {
            const blob = await exportCSV();
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "mouvements.csv";
              a.click();
            }
          }}
        />
        <Button
          icon="printeverything"
          text="Export PDF"
          onClick={handleExportPDF}
        />
      </div>
      {/* Formulaire d’ajout */}
      <AddButtonWithModal
        buttonLabel="+ Ajouter Mouvement"
        modalTitle="Ajouter Mouvement"
        onConfirm={async () => {
          await addMovement(newMovement as InventoryMovement);
          setNewMovement({
            productUUID: "",
            userUUID: "",
            date: new Date(),
            operationType: OperationType.ENTREE,
            quantity: undefined,
          });
        }}
      >
        <InputField
          placeholder="Produit"
          value={newMovement.productUUID || ""}
          onChange={(v) => setNewMovement({ ...newMovement, productUUID: v })}
        />
        <InputField
          placeholder="Opérateur"
          value={newMovement.userUUID || ""}
          onChange={(v) => setNewMovement({ ...newMovement, userUUID: v })}
        />
        <input
          type="date"
          value={
            newMovement.date
              ? new Date(newMovement.date).toISOString().slice(0, 10)
              : ""
          }
          onChange={(e) =>
            setNewMovement({ ...newMovement, date: new Date(e.target.value) })
          }
        />
        <SelectField<OperationType>
          value={newMovement.operationType!}
          onChange={(v) => setNewMovement({ ...newMovement, operationType: v })}
          options={[OperationType.ENTREE, OperationType.SORTIE]}
        />
        <InputNumberField
          placeholder="Quantité"
          value={newMovement.quantity}
          onChange={(q) => setNewMovement({ ...newMovement, quantity: q })}
        />
      </AddButtonWithModal>
      {/* Graphique (placeholder) */}
      {/* Graphique des mouvements */}
      <div className={styles.chartBox} style={{ margin: "25px 0" }}>
        <Chart dataSource={chartData}>
          <Title text="Mouvements de stock par jour" />
          <ArgumentAxis title="Date" argumentType="string" />
          <ValueAxis title="Nombre de mouvements" />
          <Legend verticalAlignment="top" horizontalAlignment="right" />
          <Series
            valueField="ENTREE"
            argumentField="date"
            name="Entrées"
            type="line"
          />
          <Series
            valueField="SORTIE"
            argumentField="date"
            name="Sorties"
            type="line"
          />
          <Tooltip enabled />
          <Export enabled={false} />
        </Chart>
      </div>

      {/* Tableau */}
      <div ref={tableRef}>
        {!loading && !error && (
          <DynamicTable<InventoryMovement>
            data={filtered}
            columns={tableColumns}
            rowKey="uuid"
            footerData={footerData}
            showActions={false}
          />
        )}
        {loading && <p>Chargement...</p>}
        {error && <p>Erreur : {error.message}</p>}
      </div>
    </div>
  );
}

export default ManagerMovementsPage;
