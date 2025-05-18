// EASY-TRACABILITY:frontend/src/hooks/useProduct.ts

import { useEffect, useState, useCallback } from "react";
import * as productService from "../services/product.service";
import { Product, NewProductPayload } from "../types/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // loadProducts mémorisé
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.fetchAllProducts();
      setProducts(data);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // au montage, on charge les produits
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getProductById = useCallback(
    async (uuid: string): Promise<Product | null> => {
      try {
        return await productService.fetchProductById(uuid);
      } catch (err: unknown) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  const addProduct = useCallback(async (product: NewProductPayload) => {
    const newProduct = await productService.createProduct(product);
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const removeProduct = useCallback(async (uuid: string) => {
    await productService.deleteProduct(uuid);
    setProducts((prev) => prev.filter((p) => p.uuid !== uuid));
  }, []);

  const modifyProduct = useCallback(
    async (uuid: string, updates: Partial<Omit<Product, "uuid">>) => {
      const updated = await productService.updateProduct(uuid, updates);
      setProducts((prev) => prev.map((p) => (p.uuid === uuid ? updated : p)));
    },
    []
  );

  const findProductsByName = useCallback(async (name: string) => {
    const found = await productService.searchProducts(name);
    setProducts(found);
  }, []);

  const loadProductsInStock = useCallback(async () => {
    const stock = await productService.getProductsInStock();
    setProducts(stock);
  }, []);

  const loadProductsOutOfStock = useCallback(async () => {
    const out = await productService.getProductsOutOfStock();
    setProducts(out);
  }, []);

  const loadProductsLowStock = useCallback(async (threshold: number = 100) => {
    const low = await productService.getProductsLowStock(threshold);
    setProducts(low);
  }, []);

  const loadProductsAbovePrice = useCallback(async (price: number) => {
    const above = await productService.getProductsAbovePrice(price);
    setProducts(above);
  }, []);

  return {
    products,
    loading,
    error,
    getProductById,
    addProduct,
    removeProduct,
    modifyProduct,
    findProductsByName,
    loadProductsInStock,
    loadProductsOutOfStock,
    loadProductsLowStock,
    loadProductsAbovePrice,
    refreshProducts: loadProducts,
  };
};
