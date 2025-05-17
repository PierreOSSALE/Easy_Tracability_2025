// EASY-TRACABILITY:frontend/src/components/common/MovementTable.tsx

import React, { useMemo } from "react";
import DynamicTable from "./DynamicTable";
import {
  InventoryMovement,
  OperationType,
} from "../../types/inventoryMovement";

interface Props {
  movements: InventoryMovement[];
}

export const MovementTable: React.FC<Props> = ({ movements }) => {
  // Calcul des totaux
  const { totalIn, totalOut } = useMemo(() => {
    let inSum = 0,
      outSum = 0;
    movements.forEach((m) => {
      if (m.operationType === OperationType.ENTREE) inSum += m.quantity;
      else outSum += m.quantity;
    });
    return { totalIn: inSum, totalOut: outSum };
  }, [movements]);

  const columns = [
    {
      header: "Produit",
      accessor: "productUUID" as const,
      render: (m: InventoryMovement) => m.productUUID,
    },
    {
      header: "Type",
      accessor: "operationType" as const,
      render: (m: InventoryMovement) =>
        m.operationType === OperationType.ENTREE ? (
          <span style={{ color: "green" }}>Entrée</span>
        ) : (
          <span style={{ color: "red" }}>Sortie</span>
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
      render: (m: InventoryMovement) => m.userUUID,
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <DynamicTable<InventoryMovement>
        data={movements}
        columns={columns}
        showActions={false}
        rowKey="uuid"
        footerData={{
          quantity: (
            <>
              Entrées :{" "}
              <span style={{ color: "green", fontWeight: "bold" }}>
                {totalIn}
              </span>{" "}
              — Sorties :{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
                {totalOut}
              </span>
            </>
          ),
        }}
      />
    </div>
  );
};
