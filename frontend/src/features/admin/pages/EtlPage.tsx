// EASY-TRACABILITY: frontend/src/features/admin/pages/EtlPage.tsx

import { useETL } from "../../../hooks/useETL";
import Button from "devextreme-react/button";
import DataGrid, { Column } from "devextreme-react/data-grid";

export default function EtlPage() {
  const { logs, running, trigger, refreshLogs, error } = useETL();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">
          ⚙️ Traitement des données (ETL)
        </h2>
        <p className="text-sm text-gray-600">
          Lancez manuellement le chargement ou consultez l’historique des
          derniers traitements.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          text={running ? "En cours…" : "▶ Lancer le traitement"}
          onClick={trigger}
          disabled={running}
          stylingMode={running ? "text" : "contained"}
        />
        <Button
          text="🔄 Actualiser"
          onClick={refreshLogs}
          stylingMode="outlined"
        />
      </div>

      {/* Erreur */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          <strong>Erreur :</strong> Impossible de charger l’historique —{" "}
          {error.message}
        </div>
      )}

      {/* Historique */}
      <div className="p-4 bg-white shadow rounded">
        <h3 className="text-lg font-semibold mb-3">
          Historique des exécutions
        </h3>
        <DataGrid dataSource={logs} showBorders rowAlternationEnabled>
          {[
            { field: "runDate", caption: "Date d’exécution" },
            { field: "status", caption: "Statut" },
            { field: "rowsExtracted", caption: "Lignes extraites" },
            { field: "rowsLoaded", caption: "Lignes chargées" },
            { field: "errorMessage", caption: "Message d’erreur" },
          ].map((col) => (
            <Column
              key={col.field}
              dataField={col.field}
              caption={col.caption}
            />
          ))}
        </DataGrid>
      </div>
    </div>
  );
}
