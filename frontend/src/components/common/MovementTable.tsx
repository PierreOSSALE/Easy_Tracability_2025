// src/components/common/MovementTable.tsx

import React from "react";
import styles from "./MovementTable.module.css";
import {
  InventoryMovement,
  OperationType,
} from "../../types/inventoryMovement";

interface Props {
  movements: InventoryMovement[];
}

export const MovementTable: React.FC<Props> = ({ movements }) => (
  <div className={styles.movementTableWrapper}>
    <table className={styles.table}>
      <caption aria-label="Derniers mouvements">Derniers mouvements</caption>
      <thead>
        <tr>
          <th>Produit</th>
          <th>Type</th>
          <th>Quantité</th>
          <th>Date</th>
          <th>Opérateur</th>
        </tr>
      </thead>
      <tbody>
        {movements.map((mvt) => (
          <tr key={mvt.uuid}>
            <td>{mvt.productUUID}</td>
            <td>
              {mvt.operationType === OperationType.ENTREE ? "Entrée" : "Sortie"}
            </td>
            <td>{mvt.quantity}</td>
            <td>{new Date(mvt.date).toLocaleDateString()}</td>
            <td>{mvt.userUUID}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
