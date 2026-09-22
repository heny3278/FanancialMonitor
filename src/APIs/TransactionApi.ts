import type { Transaction, TransactionStatus } from "../Models/transaction";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5027").replace(/\/$/, "");

function isTransactionStatus(value: unknown): value is TransactionStatus {
  return value === "Pending" || value === "Completed" || value === "Failed";
}

export function isTransaction(value: unknown): value is Transaction {
  if (!value || typeof value !== "object") return false;

  const transaction = value as Record<string, unknown>;
  return typeof transaction.transactionId === "string"
    && transaction.transactionId.length > 0
    && typeof transaction.amount === "number"
    && Number.isFinite(transaction.amount)
    && transaction.amount >= 0
    && typeof transaction.currency === "string"
    && /^[A-Za-z]{3}$/.test(transaction.currency)
    && isTransactionStatus(transaction.status)
    && typeof transaction.timestamp === "string"
    && !Number.isNaN(Date.parse(transaction.timestamp));
}

function parseTransaction(value: unknown): Transaction {
  if (!isTransaction(value)) throw new Error("The server returned an invalid transaction");
  return value;
}

async function parseTransactionList(response: Response): Promise<Transaction[]> {
  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isTransaction)) {
    throw new Error("The server returned invalid transaction data");
  }
  return payload;
}

export async function createTransaction(
  transaction: Transaction,
  signal?: AbortSignal
): Promise<Transaction> {
  const response = await fetch(`${API_URL}/api/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
    signal
  });
  

  if (!response.ok) {
    const error = await response.text().catch(() => "");
    let message = error;

    try {
      const parsed = JSON.parse(error) as { message?: string; title?: string };
      message = parsed.message ?? parsed.title ?? error;
    } catch {
      // Keep the raw response when the server does not return JSON.
    }

    throw new Error(message || `Failed to create transaction (${response.status})`);
  }

  return parseTransaction(await response.json());
}

export async function getLatestTransactions(signal?: AbortSignal): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/api/transactions?limit=100`, { signal });
  if (!response.ok) throw new Error("Failed to load transactions");
  return parseTransactionList(response);
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
