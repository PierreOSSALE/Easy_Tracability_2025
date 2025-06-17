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
  title?: string; // Nouveau prop pour titre dynamique
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  showActions?: boolean;
  rowKey: keyof T;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  footerData?: Partial<Record<keyof T, React.ReactNode>>;
  disablePagination?: boolean; // option pour désactiver la pagination
}

function DynamicTable<T extends { [key: string]: any }>({
  title,
  data,
  columns,
  onEdit,
  onDelete,
  showActions = false,
  rowKey,
  pageSizeOptions = [5, 10, 20, 50],
  defaultPageSize = 5,
  footerData,
  disablePagination = false,
}: DynamicTableProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = disablePagination ? 1 : Math.ceil(data.length / pageSize);
  const startIdx = disablePagination ? 0 : (currentPage - 1) * pageSize;
  const paginatedData = disablePagination
    ? data
    : data.slice(startIdx, startIdx + pageSize);

  // Handlers
  const handleEditClick = (item: T) => onEdit?.(item);
  const handleDeleteClick = (item: T) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };
  const closeModal = () => {
    setSelectedItem(null);
    setIsDeleteModalOpen(false);
  };
  const confirmDelete = async () => {
    if (selectedItem && onDelete) await onDelete(selectedItem);
    closeModal();
  };
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div>
      {/* Contrôle taille de page */}
      {!disablePagination && (
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
      )}

      {/* Table */}
      <div className={styles.movementTableWrapper}>
        {/* Titre dynamique du tableau */}
        {title && <h5 className={styles.tableTitle}>{title}</h5>}
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
                        onClick={() => handleEditClick(item)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {onDelete && (
                      <FaTrash
                        className="action-icon"
                        onClick={() => handleDeleteClick(item)}
                        style={{ cursor: "pointer", color: "red" }}
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
                  <td key={i}>{footerData[col.accessor] ?? ""}</td>
                ))}
                {showActions && <td />}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      {!disablePagination && (
        <div className={styles.pagination}>
          <Button
            icon="chevronleft"
            stylingMode="text"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          />
          <span className={styles.pageInfo}>
            {currentPage} / {totalPages}
          </span>
          <Button
            icon="chevronright"
            stylingMode="text"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          />
        </div>
      )}

      {/* Modal suppression */}
      {isDeleteModalOpen && selectedItem && (
        <GenericModal
          isOpen
          title="Confirmer la suppression"
          onClose={closeModal}
          onSubmit={confirmDelete}
          submitLabel="Supprimer"
          cancelLabel="Annuler"
        >
          <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        </GenericModal>
      )}
    </div>
  );
}

export default DynamicTable;
