// EASY-TRACABILITY: frontend/src/features/admin/pages/DwPage.tsx

import { useState, useMemo, useEffect } from "react";
import { useDataWarehouse } from "../../../hooks/useDataWarehouse";
import Button from "devextreme-react/button";
import DynamicTable from "../../../components/common/DynamicTable";
import { FactInventory } from "../../../types/factInventory";
import styles from "../styles/MovementsPage.module.css";

/**
 * Page Entrepôt de Données
 * Charge automatiquement les faits des 7 derniers jours à l'ouverture.
 */
export default function DwPage() {
  // Calcul des dates par défaut (7 derniers jours)
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formatDate(sevenDaysAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [dimKey, setDimKey] = useState("");

  const { facts, dimension, loadFacts, loadDimension, loading, error } =
    useDataWarehouse();

  // Charger automatiquement au montage
  useEffect(() => {
    loadFacts({ startDate, endDate });
  }, [loadFacts, startDate, endDate]);

  // Réinitialise les filtres à la période par défaut et vide la dimension
  const resetFilters = () => {
    setStartDate(formatDate(sevenDaysAgo));
    setEndDate(formatDate(today));
    setDimKey("");
    loadFacts({
      startDate: formatDate(sevenDaysAgo),
      endDate: formatDate(today),
    });
  };

  // Préparation des lignes pour la dimension sélectionnée
  const dimensionRows = useMemo(() => {
    if (!dimension) return [];
    return Object.entries(dimension).map(([attribute, value]) => ({
      attribute,
      value: String(value),
    }));
  }, [dimension]);

  return (
    <div style={{ padding: 20 }}>
      <h4>📦 Entrepôt de Données</h4>

      {/* Sélecteurs de période et filtres */}
      <div className={styles.filterBar}>
        <div>
          <label htmlFor="startDate" className="block text-sm">
            Date de début :
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.filterInput}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm">
            Date de fin :
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.filterInput}
          />
        </div>
        <input
          placeholder="Clé UUID d’une dimension"
          value={dimKey}
          onChange={(e) => setDimKey(e.target.value)}
          className={`${styles.filterInput} flex-1`}
        />
        <Button
          text="🔍 Charger dimension produit"
          onClick={() => loadDimension("product", dimKey)}
          disabled={loading || !dimKey}
        />
        <Button
          text={loading ? "Chargement…" : "🔄 Actualiser"}
          onClick={() => loadFacts({ startDate, endDate })}
          disabled={loading}
        />
        <Button
          className={styles.filterButton}
          icon="refresh"
          text="Réinitialiser"
          onClick={resetFilters}
        />
      </div>

      {error && <div className="text-red-600">{error.message}</div>}

      {/* Affichage de la dimension */}
      {dimension && (
        <div style={{ margin: "20px 0" }}>
          <h3 className="text-lg font-semibold">
            Détails de la dimension produit
          </h3>
          <DynamicTable
            data={dimensionRows}
            columns={[
              { header: "Attribut", accessor: "attribute" },
              { header: "Valeur", accessor: "value" },
            ]}
            rowKey="attribute"
            disablePagination
          />
        </div>
      )}

      {/* Tableau des faits */}
      <DynamicTable<FactInventory & { timeDim?: { date: string } }>
        title="Affichage automatique des faits pour la période sélectionnée."
        data={facts}
        columns={[
          { header: "Produit", accessor: "productUUID" },
          // On utilise la date vraie depuis la dimension
          {
            header: "Date",
            accessor: "timeDim",
            render: (row) => row.timeDim?.date ?? "",
          },
          { header: "Quantité", accessor: "quantity" },
          { header: "Total (€)", accessor: "totalPrice" },
        ]}
        rowKey="uuid"
      />
    </div>
  );
}
