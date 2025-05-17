// EASY-TRACABILITY:frontend/src/components/common/GenericEntityPage.tsx

import React, { ReactNode, useState, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DynamicTable from "./DynamicTable";
import AddButtonWithModal from "./AddButtonWithModal";
import styles from "./styles/GenericEntityPage.module.css";
import { UserRole } from "../../features/admin/types/user";
import Papa from "papaparse";

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
  items: T[];
  loading: boolean;
  error: Error | null;
  addItem: (data: any) => Promise<void>;
  updateItem: (id: string, data: Partial<T>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  itemKey: keyof T;
  columns: Column<T>[];
  renderAddForm: (state: any, setState: (state: any) => void) => ReactNode;
  defaultNewItemState: any;
  filterConfigs?: FilterConfig<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  tableFooter?: ReactNode;
  tableFooterData?: Partial<Record<keyof T, React.ReactNode>>;
}

export function GenericEntityPage<T extends { [key: string]: any }>({
  title,
  items,
  loading,
  error,
  addItem,
  updateItem,
  deleteItem,
  itemKey,
  columns,
  renderAddForm,
  defaultNewItemState,
  filterConfigs = [],
  pageSizeOptions = [5, 10, 20, 50],
  tableFooterData,
}: GenericEntityPageProps<T>) {
  const [newItemState, setNewItemState] = useState(defaultNewItemState);
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(filterConfigs.map((f) => [String(f.key), ""]))
  );
  const tableRef = useRef<HTMLDivElement>(null);
  //   const [pageSize, setPageSize] = useState(defaultPageSize);

  const handleAdd = async () => {
    await addItem(newItemState);
    setNewItemState(defaultNewItemState);
  };

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) =>
      filterConfigs.every((cfg) => cfg.filterFn(item, filters[String(cfg.key)]))
    );
  }, [items, filters]);

  const exportAsPDF = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save(`${title}.pdf`);
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          const items = result.data as any[];
          for (const item of items) {
            await addItem(item);
          }
          alert("✅ Importation terminée");
        } catch (err) {
          console.error("❌ Erreur d'import :", err);
          alert("Erreur pendant l'import");
        }
      },
    });
  };

  return (
    <div className={styles.EntityPage} style={{ margin: "20px" }}>
      {/* Filters */}
      {filterConfigs.length > 0 && (
        <div className={styles.filterBar}>
          {filterConfigs.map((cfg) => {
            if (cfg.key === "role") {
              return (
                <select
                  key="role"
                  value={filters["role"]}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
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
                key={String(cfg.key)}
                placeholder={cfg.placeholder}
                value={filters[String(cfg.key)]}
                onChange={(e) =>
                  setFilters({ ...filters, [String(cfg.key)]: e.target.value })
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

      {/* Action Bar: Export, Add, PageSize */}
      <div className={styles.actionBar}>
        <button className={styles.exportButton} onClick={exportAsPDF}>
          <span className={styles.exportIcon}>🖨️</span>{" "}
          <span>Exporter PDF</span>
        </button>

        {/* 🔄 Bouton Import CSV */}
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
          buttonLabel={`+ Ajouter ${title}`}
          modalTitle={`Ajouter ${title}`}
          onConfirm={handleAdd}
          keepOpen={true}
        >
          {renderAddForm(newItemState, setNewItemState)}
        </AddButtonWithModal>
      </div>

      {/* Exportable section */}
      <div ref={tableRef}>
        <DynamicTable<T>
          data={filteredItems}
          columns={columns}
          onEdit={(item) => updateItem(String(item[itemKey]), {})}
          onDelete={(item) => deleteItem(String(item[itemKey]))}
          showActions
          rowKey={itemKey}
          pageSizeOptions={pageSizeOptions}
          /** Passe le footerData ici */
          footerData={tableFooterData}
        />
      </div>
    </div>
  );
}
