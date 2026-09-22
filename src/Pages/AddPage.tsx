import { useState } from "react";
import { createMockTransaction, createTransaction } from "../services/api";
import type { Transaction } from "../types/transaction";

export function AddPage() {
  const [transaction, setTransaction] = useState<Transaction>(createMockTransaction());
  const [message, setMessage] = useState("");

  const update = <K extends keyof Transaction>(key: K, value: Transaction[K]) =>
    setTransaction(current => ({ ...current, [key]: value }));

  const submit = async () => {
    try {
      await createTransaction(transaction);
      setMessage("Transaction sent successfully.");
      setTransaction(createMockTransaction());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
    }
  };

  const generate = () => {
    setTransaction(createMockTransaction());
    setMessage("");
  };

  return (
    <section className="card">
      <h2>Transaction Simulator</h2>
      <p className="muted">Generate a mock transaction and send it to the backend.</p>

      <div className="form-grid">
        <label>
          Transaction ID
          <input value={transaction.transactionId}
            onChange={e => update("transactionId", e.target.value)} />
        </label>

        <label>
          Amount
          <input type="number" step="0.01" value={transaction.amount}
            onChange={e => update("amount", Number(e.target.value))} />
        </label>

        <label>
          Currency
          <input maxLength={3} value={transaction.currency}
            onChange={e => update("currency", e.target.value.toUpperCase())} />
        </label>

        <label>
          Status
          <select value={transaction.status}
            onChange={e => update("status", e.target.value as Transaction["status"])}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </label>
      </div>

      <div className="actions">
        <button onClick={generate}>Generate Random</button>
        <button className="primary" onClick={() => void submit()}>Send Transaction</button>
      </div>

      {message && <div className="message">{message}</div>}
    </section>
  );
}
