// EASY-TRACABILITY:frontend/src/hooks/useTransaction.ts

import { useEffect, useState, useCallback } from "react";
import * as transactionService from "../services/transaction.service";
import { Transaction } from "../types/transaction";

export const useTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    const data = await transactionService.fetchAllTransactions();
    setTransactions(data);
    setLoading(false);
  }, []);

  const getTransaction = useCallback(async (uuid: string) => {
    return await transactionService.fetchTransactionByUUID(uuid);
  }, []);

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, "uuid">) => {
      const created = await transactionService.createTransaction(transaction);
      setTransactions((prev) => [...prev, created]);
      return created;
    },
    []
  );

  const editTransaction = useCallback(
    async (uuid: string, updates: Partial<Omit<Transaction, "uuid">>) => {
      const updated = await transactionService.updateTransaction(uuid, updates);
      setTransactions((prev) =>
        prev.map((tx) => (tx.uuid === uuid ? updated : tx))
      );
      return updated;
    },
    []
  );

  const removeTransaction = useCallback(async (uuid: string) => {
    await transactionService.deleteTransaction(uuid);
    setTransactions((prev) => prev.filter((tx) => tx.uuid !== uuid));
  }, []);

  const downloadCSV = useCallback(async () => {
    const blob = await transactionService.exportTransactionsCSV();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const downloadInvoice = useCallback(async (uuid: string) => {
    const blob = await transactionService.generateTransactionInvoice(uuid);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `facture-${uuid}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    loadTransactions,
    getTransaction,
    addTransaction,
    editTransaction,
    removeTransaction,
    downloadCSV,
    downloadInvoice,
  };
};
