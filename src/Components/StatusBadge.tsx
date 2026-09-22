import type { TransactionStatus } from "../types/transaction";

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}>{status}</span>;
}
