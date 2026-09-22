Real-Time Financial Monitor

Stack

Backend: .NET 8 / ASP.NET Core / SignalR

Frontend: React + TypeScript + Vite

Storage: thread-safe in-memory store

Tests: xUnit + Moq

Containers: Docker

Orchestration: Kubernetes

Transaction contract

{
  "transactionId": "guid-string",
  "amount": 1500.50,
  "currency": "USD",
  "status": "Pending | Completed | Failed",
  "timestamp": "2024-01-15T10:00:00Z"
}

Run backend

cd backend/FinancialMonitor.Api
dotnet restore
dotnet run

Swagger: http://localhost:5080/swagger

Run tests

cd backend
dotnet test

Run frontend

cd frontend
npm install
npm run dev

Open http://localhost:5173

API

POST http://localhost:5080/api/transactions

GET http://localhost:5080/api/transactions?limit=100

SignalR Hub:
http://localhost:5080/hubs/transactions

Distributed architecture

The in-memory store is intentionally simple for the MVP. In a multi-pod deployment, each pod has different RAM and therefore different transactions and SignalR connections.

Production architecture:

Store transactions in PostgreSQL/SQL Server rather than RAM.

Publish every accepted transaction to Redis Pub/Sub, Azure Service Bus, RabbitMQ, or Kafka.

Configure SignalR with a Redis backplane so an event received by Pod A can be delivered to clients connected to Pods B/C.

Add an idempotency strategy using transactionId or a dedicated event ID.

Add health checks, metrics, structured logs and distributed tracing.

For Azure, Azure SignalR Service can also provide the managed real-time layer.

Performance

The frontend keeps at most 500 transactions in the live view. Updates use React state and the table is placed inside an independently scrollable container. For substantially higher throughput, the next step would be batching/throttling incoming events or windowing/virtualizing rows.

TDD

The tests cover:

newest-first storage behavior

concurrent writes

transaction processing

SignalR broadcast invocation

A production implementation could add API integration tests using WebApplicationFactory and load tests for sustained message rates.