import { useEffect, useMemo, useState } from "react";
import { getLatestTransactions } from "../APIs/TransactionApi";
import { TransactionTable } from "../Components/TransactionTable";
import { NotificationBell } from "../Components/NotificationBell";
import { useTransactionStream } from "../Hooks/useTransactionStream";

export function MonitorPage() {
  const {
    transactions,
    setTransactions,
    connected,
    newTransactionId,
    notificationTrigger
  } = useTransactionStream();
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError("");

    void getLatestTransactions(controller.signal)
      .then(latest => {
        setTransactions(latest);
        setLoading(false);
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        setTransactions([]);
        setLoadError(error instanceof Error ? error.message : "Failed to load transactions");
        setLoading(false);
      });

    return () => controller.abort();
  }, [setTransactions]);

  const visibleTransactions = useMemo(
    () => showErrorsOnly
      ? transactions.filter(t => t.status === "Failed")
      : transactions,
    [transactions, showErrorsOnly]
  );
  const completedCount = transactions.filter(transaction => transaction.status === "Completed").length;
  const failedCount = transactions.filter(transaction => transaction.status === "Failed").length;

  return (
    <section className="card monitor-card">
      <div className="monitor-header">
        <div>
          <p className="eyebrow">Live observability</p>
          <h2>Transaction stream</h2>
          <p className="muted">Real-time activity received through SignalR.</p>
        </div>
        <div className={`connection ${connected ? "online" : "offline"}`}>
          <span /> {connected ? "Connected" : "Disconnected"}
        </div>
        <NotificationBell trigger={notificationTrigger} />
      </div>

      <div className="metrics">
        <div className="metric"><span className="metric-label">Total received</span><strong className="metric-value">{transactions.length}</strong></div>
        <div className="metric"><span className="metric-label">Completed</span><strong className="metric-value success">{completedCount}</strong></div>
        <div className="metric"><span className="metric-label">Failed</span><strong className="metric-value failed">{failedCount}</strong></div>
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

      {loading && <div className="empty">Loading transactions...</div>}
      {!loading && loadError && <div className="message message-error">{loadError}</div>}
      {!loading && !loadError && <TransactionTable transactions={visibleTransactions} newTransactionId={newTransactionId} />}
    </section>
  );
}
