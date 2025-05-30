// EASY-TRACABILITY:frontend/src/components/common/MovementTable.tsx

import React, { useMemo } from "react";
import DynamicTable from "./DynamicTable";
import { MovementLine, OperationType } from "../../types/inventoryMovement";
import { useProducts } from "../../hooks/useProduct";

interface Props {
  movements: MovementLine[];
  title: string;
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

  const columns = [
    {
      header: "Produit",
      accessor: "productBarcode" as const,
      render: (m: MovementLine) => {
        const prod = products.find((p) => p.barcode === m.productBarcode);
        return prod?.name || "—";
      },
    },
    {
      header: "Type",
      accessor: "operationType" as const,
      render: (m: MovementLine) =>
        m.operationType === OperationType.ENTREE ? (
          <span style={{ color: "green" }}>Entrée</span>
        ) : (
          <span style={{ color: "red" }}>Sortie</span>
        ),
    },
    {
      header: "Quantité",
      accessor: "quantity" as const,
    },
    {
      header: "Date",
      accessor: "createdAt" as const,
      render: (m: MovementLine) =>
        new Date(m.createdAt).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <DynamicTable<MovementLine>
        title="Historique des mouvements d’inventaire"
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
