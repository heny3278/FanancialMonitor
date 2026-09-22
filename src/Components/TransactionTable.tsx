import { AnimatePresence, motion } from "framer-motion";
import type { Transaction } from "../Models/transaction";
import { StatusBadge } from "../Components/StatusBadge";    

export function TransactionTable({
  transactions,
  newTransactionId
}: {
  transactions: Transaction[];
  newTransactionId?: string | null;
}) {
  if (!transactions.length) {
    return <div className="empty">Waiting for transactions...</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {transactions.map(transaction => (
              <motion.tr
                key={transaction.transactionId}
                layout="position"
                initial={transaction.transactionId === newTransactionId
                  ? { opacity: 0, y: -18, scale: 0.985 }
                  : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <td data-label="Transaction ID" className="mono">{transaction.transactionId}</td>
                <td data-label="Amount">{transaction.amount.toFixed(2)}</td>
                <td data-label="Currency">{transaction.currency}</td>
                <td data-label="Status">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      key={transaction.status}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.32 }}
                    >
                      <StatusBadge status={transaction.status} />
                    </motion.span>
                  </AnimatePresence>
                </td>
                <td data-label="Timestamp">{new Date(transaction.timestamp).toLocaleString()}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
