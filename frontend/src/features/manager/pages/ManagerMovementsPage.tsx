// EASY-TRACABILITY: frontend/src/features/admin/pages/MovementsPage.tsx

import React, { useEffect, useState, useMemo } from "react";
import DynamicTable from "../../../components/common/DynamicTable";
import Button from "devextreme-react/button";
import styles from "../../admin/styles/MovementsPage.module.css";
import { useInventoryMovements } from "../../../hooks/useInventoryMovement";
import { MovementLine } from "../../../types/inventoryMovement";

export default function MovementsPage() {
  const { lines, loading, error, loadAllLines, exportCSV } =
    useInventoryMovements();

  // filtres locaux
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [productFilter, setProductFilter] = useState<string>("");

  useEffect(() => {
    loadAllLines();
  }, [loadAllLines]);

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setProductFilter("");
    loadAllLines();
  };

  // filtrage
  const filtered: MovementLine[] = useMemo(() => {
    return lines
      .filter((m) => {
        const dateStr = new Date(m.createdAt).toISOString().slice(0, 10);
        if (dateFrom && dateStr < dateFrom) return false;
        if (dateTo && dateStr > dateTo) return false;
        return true;
      })
      .filter((m) =>
        productFilter
          ? m.productBarcode.toLowerCase().includes(productFilter.toLowerCase())
          : true
      );
  }, [lines, dateFrom, dateTo, productFilter]);

  // Totaux pour le footer
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

  const footerData: Partial<Record<keyof MovementLine, React.ReactNode>> = {
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

        <Button
          className={styles.filterButton}
          icon="filter"
          text="Filtrer"
          onClick={loadAllLines}
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
        <DynamicTable<MovementLine>
          data={filtered}
          columns={[
            { header: "Produit", accessor: "productBarcode" as const },
            {
              header: "Type",
              accessor: "operationType" as const,
              render: (m: MovementLine) =>
                m.operationType === "ENTREE" ? (
                  <>
                    <i className="dx-icon-arrowup" style={{ color: "green" }} />{" "}
                    ENTREE
                  </>
                ) : (
                  <>
                    <i className="dx-icon-arrowdown" style={{ color: "red" }} />{" "}
                    SORTIE
                  </>
                ),
            },
            { header: "Quantité", accessor: "quantity" as const },
            {
              header: "Date",
              accessor: "createdAt" as const,
              render: (m: MovementLine) =>
                new Date(m.createdAt).toLocaleDateString(),
            },
          ]}
          rowKey="uuid"
          footerData={footerData}
          showActions={false}
        />
      )}

      {loading && <p>Chargement des mouvements...</p>}
      {error && <p>Erreur : {error.message}</p>}
    </div>
  );
}
