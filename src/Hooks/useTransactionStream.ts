import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from "@microsoft/signalr";
import type { Transaction } from "../Models/transaction";
import { API_URL, isTransaction } from "../APIs/TransactionApi";

const MAX_VISIBLE_TRANSACTIONS = 500;

export function useTransactionStream() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransactionId, setNewTransactionId] = useState<string | null>(null);
  const [notificationTrigger, setNotificationTrigger] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    const connection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/transactions`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on("TransactionReceived", (transaction: Transaction) => {
      if (!mounted) return;
      if (!isTransaction(transaction)) return;

      setNewTransactionId(transaction.transactionId);
      setNotificationTrigger(`${transaction.transactionId}-${Date.now()}`);
      setTransactions(current => {
        const existingIndex = current.findIndex(
          item => item.transactionId === transaction.transactionId
        );

        if (existingIndex >= 0) {
          const next = [...current];
          next[existingIndex] = transaction;
          return next;
        }

        const next = [transaction, ...current];
        return next.length > MAX_VISIBLE_TRANSACTIONS
          ? next.slice(0, MAX_VISIBLE_TRANSACTIONS)
          : next;
      });
    });

    const start = async () => {
      try {
        await connection.start();
        if (mounted) setConnected(true);
      } catch {
        if (mounted) setConnected(false);
      }
    };

    connection.onreconnecting(() => mounted && setConnected(false));
    connection.onreconnected(() => mounted && setConnected(true));
    connection.onclose(() => mounted && setConnected(false));

    void start();

    return () => {
      mounted = false;
      if (connection.state !== HubConnectionState.Disconnected) {
        void connection.stop();
      }
    };
  }, []);

  return {
    transactions,
    setTransactions,
    connected,
    newTransactionId,
    notificationTrigger
  };
}
