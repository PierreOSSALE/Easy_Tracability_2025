// frontend/src/components/common/BaseProductsPage.tsx

import React, { useMemo } from "react";
import { useProducts } from "../../hooks/useProduct";
import { Product } from "../../types/product";
import { Column, FilterConfig, GenericEntityPage } from "./GenericEntityPage";
import InputField from "./InputField";
import InputNumberField from "./InputNumberField";

export interface BaseProductsPageProps {
  title?: string;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  pageSizeOptions?: number[];
}

export const BaseProductsPage: React.FC<BaseProductsPageProps> = ({
  title = "Produits",
  canAdd = true,
  canEdit = true,
  canDelete = true,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  const { products, loading, error, addProduct, modifyProduct, removeProduct } =
    useProducts();

  const columns: Column<Product>[] = [
    { header: "Nom", accessor: "name" },
    { header: "Code‑barres", accessor: "barcode" },
    {
      header: "Stock",
      accessor: "stockQuantity",
      render: (p) => {
        const q = p.stockQuantity;
        const color = q === 0 ? "red" : q < 10 ? "orange" : "green";
        return (
          <span>
            <i
              className="fa fa-circle"
              style={{ color, marginRight: 6, fontSize: "0.7rem" }}
            />
            {q}
          </span>
        );
      },
    },
    {
      header: "Prix (€)",
      accessor: "price",
      render: (p) => `${p.price.toFixed(2)} €`,
    },
    {
      header: "Image",
      accessor: "imageUrl",
      render: (p) =>
        p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            style={{ width: 40, height: 40, borderRadius: 4 }}
          />
        ) : (
          "—"
        ),
    },
  ];

  const filters: FilterConfig<Product>[] = [
    {
      key: "name",
      placeholder: "Filtrer par nom",
      filterFn: (p, v) =>
        v ? p.name.toLowerCase().includes(v.toLowerCase()) : true,
    },
    {
      key: "barcode",
      placeholder: "Filtrer par code‑barres",
      filterFn: (p, v) => (v ? p.barcode.includes(v) : true),
    },
    {
      key: "description",
      placeholder: "Filtrer par description",
      filterFn: (p, v) =>
        v ? p.description.toLowerCase().includes(v.toLowerCase()) : true,
    },
    {
      key: "price",
      placeholder: "Prix ≥",
      filterFn: (p, v) =>
        v && !isNaN(Number(v)) ? p.price >= Number(v) : true,
    },
    {
      key: "stockQuantity",
      placeholder: "Stock ≤",
      filterFn: (p, v) =>
        v && !isNaN(Number(v)) ? p.stockQuantity <= Number(v) : true,
    },
  ];

  const totalPrice = useMemo(
    () => products.reduce((sum, p) => sum + p.price, 0).toFixed(2),
    [products]
  );

  return (
    <GenericEntityPage<Product>
      title={title}
      items={products}
      loading={loading}
      error={error}
      addItem={canAdd ? addProduct : async () => Promise.resolve()}
      updateItem={
        canEdit
          ? (id, data) => modifyProduct(id, data)
          : async () => Promise.resolve()
      }
      deleteItem={canDelete ? removeProduct : async () => Promise.resolve()}
      itemKey="uuid"
      columns={columns}
      defaultNewItemState={{
        name: "",
        barcode: "",
        description: "",
        price: undefined,
        stockQuantity: undefined,
        imageUrl: "",
      }}
      renderAddForm={(state, setState) =>
        canAdd && (
          <>
            <InputField
              value={state.name}
              onChange={(v) => setState({ ...state, name: v })}
              placeholder="Nom du produit"
              icon="fa fa-tag"
            />
            <InputField
              value={state.barcode}
              onChange={(v) => setState({ ...state, barcode: v })}
              placeholder="Code‑barres"
              icon="fa fa-barcode"
            />
            <InputNumberField
              icon="fa fa-boxes"
              placeholder="Quantité en stock"
              value={state.stockQuantity}
              onChange={(val) => setState({ ...state, stockQuantity: val })}
              min={0}
            />
            <InputNumberField
              icon="fa fa-euro-sign"
              placeholder="Prix unitaire (€)"
              value={state.price}
              onChange={(val) => setState({ ...state, price: val })}
              min={0}
              step={0.01}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setState({
                      ...state,
                      imageUrl: ev.target?.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </>
        )
      }
      filterConfigs={filters}
      tableFooterData={{
        price: <span style={{ color: "red" }}>{totalPrice} €</span>,
      }}
      pageSizeOptions={pageSizeOptions}
    />
  );
};
