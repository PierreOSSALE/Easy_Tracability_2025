// EASY-TRACABILITY:frontend/src/services/product.service.ts

import { apiClient } from "./api.service";
import { apiWrapper } from "../utils/apiWrapper";
import { Product, NewProductPayload } from "../types/product";

// 🔄 Récupérer tous les produits
export const fetchAllProducts = (): Promise<Product[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/products");
    return res.data.data;
  });
};

// 🔄 Récupérer un produit par UUID
export const fetchProductById = (uuid: string): Promise<Product> => {
  return apiWrapper(async () => {
    const res = await apiClient.get(`/products/${uuid}`);
    return res.data.data;
  });
};

// ➕ Créer un produit
export const createProduct = (
  productData: NewProductPayload
): Promise<Product> => {
  return apiWrapper(async () => {
    const res = await apiClient.post("/products", productData);
    return res.data.data;
  });
};

// ✏️ Modifier un produit
export const updateProduct = (
  uuid: string,
  productData: Partial<Omit<Product, "uuid">>
): Promise<Product> => {
  return apiWrapper(async () => {
    const res = await apiClient.put(`/products/${uuid}`, productData);
    return res.data.data;
  });
};

// ❌ Supprimer un produit
export const deleteProduct = (uuid: string): Promise<void> => {
  return apiWrapper(async () => {
    await apiClient.delete(`/products/${uuid}`);
  });
};

// 🔍 Rechercher par nom
export const searchProducts = (name: string): Promise<Product[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/products/search", {
      params: { name },
    });
    return res.data.data;
  });
};

// 📦 Produits en stock
export const getProductsInStock = (): Promise<Product[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/products/in-stock");
    return res.data.data; // ← accède à l'objet réel
  });
};

// 🔻 Produits à stock faible
export const getProductsLowStock = (threshold: number): Promise<Product[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/products/low-stock", {
      params: { threshold },
    });
    return res.data.data; // ← ici aussi
  });
};

// ⚠️ Produits en rupture de stock
export const getProductsOutOfStock = (): Promise<Product[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/products/out-of-stock");
    return res.data.data;
  });
};

// 💸 Produits au-dessus d’un certain prix
export const getProductsAbovePrice = (price: number): Promise<Product[]> => {
  return apiWrapper(async () => {
    const res = await apiClient.get("/products/above-price", {
      params: { price },
    });
    return res.data.data;
  });
};
