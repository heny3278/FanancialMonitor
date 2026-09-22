import { useState } from "react";
import { createMockTransaction, createTransaction } from "../APIs/TransactionApi";
import type { Transaction } from "../Models/transaction";

export function AddPage() {
  const [transaction, setTransaction] = useState<Transaction>(createMockTransaction());
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const update = <K extends keyof Transaction>(key: K, value: Transaction[K]) =>
    setTransaction(current => ({ ...current, [key]: value }));

  const submit = async () => {
    try {
      await createTransaction(transaction);
      setMessage("Transaction sent successfully.");
      setMessageType("success");
      setTransaction(createMockTransaction());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
      setMessageType("error");
    }
  };

  const generate = () => {
    setTransaction(createMockTransaction());
    setMessage("");
    setMessageType("success");
  };

  return (
    <section className="card form-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Outbound event</p>
          <h2>Transaction simulator</h2>
          <p>Generate a mock transaction and send it to the backend.</p>
        </div>
      </div>

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

      {message && <div className={`message message-${messageType}`}>{message}</div>}
    </section>
  );
}
