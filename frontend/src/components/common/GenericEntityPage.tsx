// EASY-TRACABILITY:frontend/src/components/common/GenericEntityPage.tsx

import React, { ReactNode, useState, useMemo, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DynamicTable from "./DynamicTable";
import AddButtonWithModal from "./AddButtonWithModal";
import styles from "./styles/GenericEntityPage.module.css";
import { UserRole } from "../../features/admin/types/user";
import Papa from "papaparse";
import GenericModal from "./GenericModal";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

export interface FilterConfig<T> {
  key: keyof T;
  placeholder: string;
  filterFn: (item: T, value: string) => boolean;
}

export interface GenericEntityPageProps<T> {
  title?: string;
  titleBtn?: string;
  items: T[];
  loading: boolean;
  error: Error | null;
  addItem: (data: any) => Promise<void>;
  updateItem: (id: string, data: Partial<T>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  itemKey: keyof T;
  columns: Column<T>[];
  renderAddForm: (state: any, setState: (state: any) => void) => ReactNode;
  renderEditForm?: (
    state: T,
    setState: React.Dispatch<React.SetStateAction<T>>
  ) => ReactNode;
  defaultNewItemState: any;
  filterConfigs?: FilterConfig<T>[];
  pageSizeOptions?: number[];
  tableFooterData?: Partial<Record<keyof T, React.ReactNode>>;
}

export function GenericEntityPage<T extends { [key: string]: any }>({
  title,
  titleBtn,
  items,
  loading,
  error,
  addItem,
  updateItem,
  deleteItem,
  itemKey,
  columns,
  renderAddForm,
  renderEditForm,
  defaultNewItemState,
  filterConfigs = [],
  pageSizeOptions = [5, 10, 20, 50],
  tableFooterData,
}: GenericEntityPageProps<T>) {
  const [newItemState, setNewItemState] = useState(defaultNewItemState);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState<T | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Gestion des filtres persistés en localStorage
  const storageKey = title || "EntityPage";
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`filters:${storageKey}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore parse error
      }
    }
    return Object.fromEntries(filterConfigs.map((f) => [String(f.key), ""]));
  });

  // Sauvegarde des filtres à chaque modification
  useEffect(() => {
    localStorage.setItem(`filters:${storageKey}`, JSON.stringify(filters));
  }, [filters, storageKey]);

  // Ajout d'un nouvel item
  const handleAdd = async () => {
    await addItem(newItemState);
    setNewItemState(defaultNewItemState);
  };

  // Flux d'édition
  const handleEditClick = (item: T) => {
    setEditingId(String(item[itemKey]));
    setEditState(item);
    setIsEditOpen(true);
  };

  const handleEditConfirm = async () => {
    if (editingId && editState) {
      await updateItem(editingId, editState);
      setIsEditOpen(false);
    }
  };

  // Filtrage des items
  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        filterConfigs.every((cfg) =>
          cfg.filterFn(item, filters[String(cfg.key)])
        )
      ),
    [items, filters, filterConfigs]
  );

  // Export en PDF
  const exportAsPDF = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save(`${title || "export"}.pdf`);
  };

  // Import CSV
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          const itemsToAdd = result.data as any[];
          for (const it of itemsToAdd) {
            await addItem(it);
          }
          alert("✅ Importation terminée");
        } catch {
          alert("❌ Erreur pendant l’import");
        }
      },
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className={styles.EntityPage} style={{ margin: "20px" }}>
      {/* Barre de filtres */}
      {filterConfigs.length > 0 && (
        <div className={styles.filterBar}>
          {filterConfigs.map((cfg) => {
            const key = String(cfg.key);
            if (cfg.key === "role") {
              return (
                <select
                  key={key}
                  value={filters[key]}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                >
                  <option value="">Tous les rôles</option>
                  {Object.values(UserRole).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              );
            }
            return (
              <input
                key={key}
                placeholder={cfg.placeholder}
                value={filters[key]}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            );
          })}
          <button
            className={styles.resetButton}
            onClick={() =>
              setFilters(
                Object.fromEntries(
                  filterConfigs.map((f) => [String(f.key), ""])
                )
              )
            }
          >
            Réinitialiser
          </button>
        </div>
      )}

      {/* Barre d'actions */}
      <div className={styles.actionBar}>
        <button className={styles.exportButton} onClick={exportAsPDF}>
          🖨️ Exporter PDF
        </button>
        <label className={styles.importLabel}>
          📥 Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVImport}
            style={{ display: "none" }}
          />
        </label>
        <AddButtonWithModal
          buttonLabel={`+ Ajouter ${titleBtn}`}
          modalTitle={`Ajouter ${titleBtn}`}
          onConfirm={handleAdd}
          keepOpen
        >
          {renderAddForm(newItemState, setNewItemState)}
        </AddButtonWithModal>
      </div>

      {/* Tableau */}
      <div ref={tableRef}>
        <DynamicTable<T>
          data={filteredItems}
          columns={columns}
          title={title}
          onEdit={renderEditForm ? handleEditClick : undefined}
          onDelete={(item) => deleteItem(String(item[itemKey]))}
          showActions
          rowKey={itemKey}
          pageSizeOptions={pageSizeOptions}
          footerData={tableFooterData}
        />
      </div>

      {/* Modal d'édition */}
      {renderEditForm && isEditOpen && editState && (
        <GenericModal
          isOpen
          title={`Modifier ${title}`}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEditConfirm}
          submitLabel="Enregistrer"
          cancelLabel="Annuler"
        >
          {renderEditForm(
            editState,
            setEditState as React.Dispatch<React.SetStateAction<T>>
          )}
        </GenericModal>
      )}
    </div>
  );
}
