// EASY-TRACABILITY:frontend/src/components/common/MovementTable.tsx

import React, { useMemo } from "react";
import DynamicTable from "./DynamicTable";
import {
  InventoryMovement,
  OperationType,
} from "../../types/inventoryMovement";
import { useProducts } from "../../hooks/useProduct";

interface Props {
  movements: InventoryMovement[];
}

export const MovementTable: React.FC<Props> = ({ movements }) => {
  const { products } = useProducts();

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

  const columns: {
    header: string;
    accessor: keyof InventoryMovement;
    render?: (m: InventoryMovement) => React.ReactNode;
  }[] = [
    {
      header: "Produit",
      accessor: "productBarcode",
      render: (m: InventoryMovement) => {
        const prod = products.find((p) => p.barcode === m.productBarcode);
        return prod?.name || "—";
      },
    },
    {
      header: "Type",
      accessor: "operationType",
      render: (m: InventoryMovement) =>
        m.operationType === OperationType.ENTREE ? (
          <span style={{ color: "green" }}>Entrée</span>
        ) : (
          <span style={{ color: "red" }}>Sortie</span>
        ),
    },
    {
      header: "Quantité",
      accessor: "quantity",
      render: (m: InventoryMovement) => m.quantity,
    },
    {
      header: "Date",
      accessor: "date",
      render: (m: InventoryMovement) =>
        new Date(m.date).toLocaleDateString("fr-FR"),
    },
    {
      header: "Opérateur",
      accessor: "userUUID",
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
