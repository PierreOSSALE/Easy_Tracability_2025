// EASY-TRACABILITY: frontend/src/features/admin/pages/MovementsPage.tsx

import React, { useEffect, useState, useMemo } from "react";
import DynamicTable from "../../../components/common/DynamicTable";
import Button from "devextreme-react/button";
import styles from "../styles/MovementsPage.module.css";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import { InventoryMovement } from "../../../types/inventoryMovement"; // Ajuste le chemin si besoin

export default function MovementsPage() {
  const { movements, loading, error, loadAllMovements, exportCSV } =
    useInventoryMovements();

  // filtres locaux
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [productFilter, setProductFilter] = useState<string>("");
  const [operatorFilter, setOperatorFilter] = useState<string>("");

  useEffect(() => {
    loadAllMovements();
  }, [loadAllMovements]);

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setProductFilter("");
    setOperatorFilter("");
    loadAllMovements();
  };

  // filtrage
  const filtered: InventoryMovement[] = useMemo(() => {
    return movements
      .filter((m) => {
        // m.date peut être string (ISO) ou Date
        const raw = m.date as string | Date;
        const d =
          typeof raw === "string"
            ? raw.slice(0, 10)
            : raw.toISOString().slice(0, 10);
        if (dateFrom && d < dateFrom) return false;
        if (dateTo && d > dateTo) return false;
        return true;
      })
      .filter((m) =>
        productFilter
          ? m.productUUID.toLowerCase().includes(productFilter.toLowerCase())
          : true
      )
      .filter((m) =>
        operatorFilter
          ? m.userUUID.toLowerCase().includes(operatorFilter.toLowerCase())
          : true
      );
  }, [movements, dateFrom, dateTo, productFilter, operatorFilter]);

  // définition des colonnes
  const columns = [
    {
      header: "Produit",
      accessor: "productUUID" as const,
    },
    {
      header: "Type",
      accessor: "operationType" as const,
      render: (m: InventoryMovement) =>
        m.operationType === "ENTREE" ? (
          <>
            <i
              className="dx-icon-arrowup"
              style={{ color: "green", fontSize: "1.2rem" }}
            />
            ENTREE
          </>
        ) : (
          <>
            <i
              className="dx-icon-arrowdown"
              style={{ color: "red", fontSize: "1.2rem" }}
            />
            SORTIE
          </>
        ),
    },
    {
      header: "Quantité",
      accessor: "quantity" as const,
      render: (m: InventoryMovement) => m.quantity,
    },
    {
      header: "Date",
      accessor: "date" as const,
      render: (m: InventoryMovement) => new Date(m.date).toLocaleDateString(),
    },
    {
      header: "Opérateur",
      accessor: "userUUID" as const,
    },
  ];

  // calcul des totaux pour le footer
  const totalEntered = useMemo(
    () =>
      filtered
        .filter((m) => m.operationType === "ENTREE")
        .reduce((sum, m) => sum + m.quantity, 0),
    [filtered]
  );
  const totalExited = useMemo(
    () =>
      filtered
        .filter((m) => m.operationType === "SORTIE")
        .reduce((sum, m) => sum + m.quantity, 0),
    [filtered]
  );

  const footerData: Partial<Record<keyof InventoryMovement, React.ReactNode>> =
    {
      quantity: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontWeight: 600,
          }}
        >
          <span>
            <i
              className="dx-icon-arrowup"
              style={{ color: "green", marginRight: 4 }}
            />
            {totalEntered}
          </span>
          <span>
            <i
              className="dx-icon-arrowdown"
              style={{ color: "red", marginRight: 4 }}
            />
            {totalExited}
          </span>
        </div>
      ),
    };

  return (
    <div style={{ padding: 20 }}>
      <h4>Mouvements d'inventaire</h4>

      <div className={styles.filterBar}>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Filtrer par produit"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Filtrer par opérateur"
          value={operatorFilter}
          onChange={(e) => setOperatorFilter(e.target.value)}
          className={styles.filterInput}
        />

        <Button
          className={styles.filterButton}
          icon="filter"
          text="Filtrer"
          onClick={() => loadAllMovements()}
        />
        <Button
          className={styles.filterButton}
          icon="refresh"
          text="Réinitialiser"
          onClick={resetFilters}
        />
        <Button
          className={styles.filterButton}
          icon="exportxlsx"
          text="Exporter CSV"
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
      </div>

      {!loading && !error && (
        <DynamicTable<InventoryMovement>
          data={filtered}
          columns={columns}
          rowKey="uuid"
          pageSizeOptions={[5, 10, 20, 50]}
          defaultPageSize={10}
          footerData={footerData}
          showActions={false}
        />
      )}

      {loading && <p>Chargement des mouvements...</p>}
      {error && <p>Erreur : {error.message}</p>}
    </div>
  );
}
