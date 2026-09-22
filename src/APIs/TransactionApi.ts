import type { Transaction, TransactionStatus } from "../types/transaction";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5080";

export async function createTransaction(
  transaction: Transaction
): Promise<Transaction> {
  const response = await fetch(`${API_URL}/api/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to create transaction");
  }

  return response.json();
}

export async function getLatestTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/api/transactions?limit=100`);
  if (!response.ok) throw new Error("Failed to load transactions");
  return response.json();
}

export function createMockTransaction(): Transaction {
  const statuses: TransactionStatus[] = ["Pending", "Completed", "Failed"];

  return {
    transactionId: crypto.randomUUID(),
    amount: Number((Math.random() * 5000 + 10).toFixed(2)),
    currency: "USD",
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: new Date().toISOString()
  };
}

export { API_URL };
