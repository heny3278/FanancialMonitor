import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from "@microsoft/signalr";
import type { Transaction } from "../types/transaction";
import { API_URL } from "../services/api";

const MAX_VISIBLE_TRANSACTIONS = 500;

export function useTransactionStream() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

      setTransactions(current => {
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

  return { transactions, setTransactions, connected };
}
