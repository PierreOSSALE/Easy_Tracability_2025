// EASY-TRACABILITY:frontend/src/components/common/DynamicTable.tsx

import React, { useState } from "react";
import styles from "./styles/DynamicTable.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import GenericModal from "./GenericModal";
import Button from "devextreme-react/button";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  showActions?: boolean;
  rowKey: keyof T;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  /** Footer data: map accessor to a custom cell in the tfoot */
  footerData?: Partial<Record<keyof T, React.ReactNode>>;
}

function DynamicTable<T extends { [key: string]: any }>({
  data,
  columns,
  onEdit,
  onDelete,
  showActions = false,
  rowKey,
  pageSizeOptions = [5, 10, 20, 50],
  defaultPageSize = 8,
  footerData,
}: DynamicTableProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIdx, startIdx + pageSize);

  const openModal = (item: T, type: "edit" | "delete") => {
    setSelectedItem(item);
    setModalType(type);
  };
  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
  };
  const handleModalSubmit = () => {
    if (modalType === "edit" && selectedItem && onEdit) onEdit(selectedItem);
    if (modalType === "delete" && selectedItem && onDelete)
      onDelete(selectedItem);
    closeModal();
  };
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div>
      {/* Page size selector */}
      <div className={styles.pageSizeControl}>
        <label>Afficher </label>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} / page
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className={styles.movementTableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.header}</th>
              ))}
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={String(item[rowKey])}>
                {columns.map((col, i) => (
                  <td key={i}>
                    {col.render ? col.render(item) : String(item[col.accessor])}
                  </td>
                ))}
                {showActions && (
                  <td>
                    {onEdit && (
                      <FaEdit
                        className="action-icon"
                        onClick={() => openModal(item, "edit")}
                      />
                    )}
                    {onDelete && (
                      <FaTrash
                        className="action-icon"
                        onClick={() => openModal(item, "delete")}
                      />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          {footerData && (
            <tfoot>
              <tr>
                {columns.map((col, i) => (
                  <td
                    key={i}
                    style={
                      footerData[col.accessor]
                        ? { fontWeight: "400" }
                        : undefined
                    }
                  >
                    {footerData[col.accessor] ?? ""}
                  </td>
                ))}
                {showActions && <td />}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <Button
          icon="chevronleft"
          stylingMode="text"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
          className={styles.pageButton}
        />
        <span className={styles.pageInfo}>
          {currentPage} / {totalPages}
        </span>
        <Button
          icon="chevronright"
          stylingMode="text"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className={styles.pageButton}
        />
      </div>

      {/* Edit/Delete modal */}
      {modalType && selectedItem && (
        <GenericModal
          isOpen
          title={
            modalType === "edit"
              ? "Modifier l'élément"
              : "Confirmer la suppression"
          }
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          submitLabel={modalType === "edit" ? "Enregistrer" : "Supprimer"}
        >
          {modalType === "delete" && (
            <p>Es-tu sûr de vouloir supprimer cet élément ?</p>
          )}
        </GenericModal>
      )}
    </div>
  );
}

export default DynamicTable;
