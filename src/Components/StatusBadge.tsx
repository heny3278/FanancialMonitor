import type { TransactionStatus } from "../Models/transaction";

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}>{status}</span>;
}
