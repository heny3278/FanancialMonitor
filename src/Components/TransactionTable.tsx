import { AnimatePresence, motion } from "framer-motion";
import type { Transaction } from "../types/transaction";
import { StatusBadge } from "./StatusBadge";

export function TransactionTable({
  transactions
}: {
  transactions: Transaction[];
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
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                <td className="mono">{transaction.transactionId}</td>
                <td>{transaction.amount.toFixed(2)}</td>
                <td>{transaction.currency}</td>
                <td><StatusBadge status={transaction.status} /></td>
                <td>{new Date(transaction.timestamp).toLocaleString()}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
