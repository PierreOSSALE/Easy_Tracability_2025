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
  title = "Historique des Produits",
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
            src={
              p.imageUrl.startsWith("data:")
                ? p.imageUrl
                : `${import.meta.env.VITE_API_BASE_URL}${p.imageUrl}`
            }
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

  // 1. Valeur totale du stock : somme de (prix * quantité)
  const totalInventoryValue = useMemo(() => {
    const value = products.reduce(
      (sum, p) => sum + p.price * p.stockQuantity,
      0
    );
    return value.toFixed(2);
  }, [products]);

  // 2. Nombre de produits en rupture de stock
  const outOfStockCount = useMemo(
    () => products.filter((p) => p.stockQuantity === 0).length,
    [products]
  );

  return (
    <GenericEntityPage<Product>
      title={title}
      titleBtn="produit"
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
      renderEditForm={(state, setState) => (
        <>
          <InputField
            icon="fa fa-tag"
            value={state.name}
            onChange={(v) => setState((s) => ({ ...s, name: v }))}
            placeholder="Nom du produit"
          />
          <InputNumberField
            icon="fa fa-euro-sign"
            value={state.price}
            onChange={(n) => setState((s) => ({ ...s, price: n }))}
            placeholder="Prix"
            min={0}
          />
          <InputNumberField
            icon="fa fa-boxes"
            value={state.stockQuantity}
            onChange={(n) => setState((s) => ({ ...s, stockQuantity: n }))}
            placeholder="Stock"
            min={0}
          />
        </>
      )}
      filterConfigs={filters}
      tableFooterData={{
        // colonne "Prix (€)" devient valeur totale du stock
        price: (
          <span style={{ fontWeight: 600, color: "var(--color-success)" }}>
            Valeur stock : {totalInventoryValue} €
          </span>
        ),
        // colonne "Stock" affiche aussi le nombre de ruptures
        stockQuantity: (
          <span style={{ fontWeight: 600, color: "var(--color-error)" }}>
            Ruptures : {outOfStockCount}
          </span>
        ),
      }}
      pageSizeOptions={pageSizeOptions}
    />
  );
};
