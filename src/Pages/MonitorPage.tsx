import { useEffect, useMemo, useState } from "react";
import { getLatestTransactions } from "../services/api";
import { TransactionTable } from "../components/TransactionTable";
import { useTransactionStream } from "../hooks/useTransactionStream";

export function MonitorPage() {
  const { transactions, setTransactions, connected } = useTransactionStream();
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);

  useEffect(() => {
    void getLatestTransactions()
      .then(setTransactions)
      .catch(() => setTransactions([]));
  }, [setTransactions]);

  const visibleTransactions = useMemo(
    () => showErrorsOnly
      ? transactions.filter(t => t.status === "Failed")
      : transactions,
    [transactions, showErrorsOnly]
  );

  return (
    <section className="card">
      <div className="monitor-header">
        <div>
          <h2>Live Dashboard</h2>
          <p className="muted">Real-time transactions received through SignalR.</p>
        </div>
        <div className={`connection ${connected ? "online" : "offline"}`}>
          <span /> {connected ? "Connected" : "Disconnected"}
        </div>
      </div>

      <div className="toolbar">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={showErrorsOnly}
            onChange={e => setShowErrorsOnly(e.target.checked)}
          />
          Show only errors
        </label>
        <span>{visibleTransactions.length} displayed</span>
      </div>

      <TransactionTable transactions={visibleTransactions} />
    </section>
  );
}
