# Webhook Delivery Platform

A webhook delivery platform built to explore reliable asynchronous event processing, background job execution, and fault-tolerant delivery systems.

Built with **Node.js, Express, PostgreSQL, Prisma, Redis, BullMQ, and Angular**.

## Overview

Webhooks are a common way for applications to communicate with external services through HTTP callbacks. However, reliably delivering these events introduces several engineering challenges, including network failures, retries, duplicate deliveries, concurrency, and failure recovery.

This project aims to address these challenges by providing a centralized platform where users can register webhook destinations, ingest events, and monitor their delivery lifecycle.

Instead of processing webhook deliveries directly within an API request, the platform uses asynchronous background workers to handle delivery independently, improving reliability and keeping the ingestion process decoupled from external services.

## Key Features

- **Webhook Destinations:** Register and manage external webhook endpoints.
- **Event Ingestion:** Accept events through REST APIs and associate them with registered destinations.
- **Asynchronous Processing:** Process webhook deliveries using Redis and BullMQ.
- **Background Workers:** Execute HTTP requests independently of the API server.
- **Automatic Retries:** Retry failed deliveries using exponential backoff.
- **Delivery Tracking:** Maintain detailed records of individual delivery attempts, including their outcomes.
- **Job Management:** Track delivery jobs and their execution status.
- **Authentication:** JWT-based authentication.
- **Resource-Level Authorization:** Ensure users can only access resources belonging to their accounts.
- **API Key Management:** Support secure authentication for incoming event requests.
- **Docker:** Containerized infrastructure for local development.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | Angular, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Queue | BullMQ |
| Message Broker | Redis |
| Authentication | JSON Web Tokens (JWT) |
| Containerization | Docker |

## Architecture

The platform follows an asynchronous event-driven processing approach.

```mermaid
flowchart TD
    A[Client Application] -->|HTTP Request| B[Node.js API]
    B --> C[Authentication & Authorization]
    C --> D[Event Ingestion]
    D --> E[(PostgreSQL)]
    E --> F[Delivery Job]
    F --> G[Redis Queue]
    G --> H[Background Worker]
    H -->|HTTP POST| I[External Webhook Endpoint]
    H --> J[(Delivery Attempts)]
    J --> E
    H -->|Failure| K[Retry Mechanism]
    K --> G
```

### Event Processing Workflow

1. A client submits an event through the API.
2. The API validates the request and identifies the target webhook destination.
3. The event and its corresponding delivery job are persisted in PostgreSQL.
4. The job is made available for asynchronous processing.
5. A background worker picks up the job from the BullMQ queue.
6. The worker sends an HTTP POST request to the registered destination.
7. The delivery outcome is recorded in the database.
8. Failed deliveries are retried according to the configured retry policy.

## Database Design

The application uses PostgreSQL to persist events, destinations, delivery jobs, and delivery attempts.

The core entities include:

| Entity | Responsibility |
|---|---|
| Users | Stores user and account information |
| Destinations | Stores registered webhook endpoints |
| Events | Stores incoming event payloads and metadata |
| Delivery Jobs | Tracks scheduled and pending delivery operations |
| Delivery Attempts | Records individual HTTP delivery attempts and their outcomes |

## Engineering Concepts Explored

One of the primary goals of this project was to go beyond conventional CRUD development and understand the engineering challenges involved in building reliable backend systems.

Some of the concepts explored include:

- Asynchronous processing and message queues
- Background workers and job scheduling
- Retry strategies and exponential backoff
- Redis and BullMQ
- PostgreSQL triggers and `LISTEN/NOTIFY` using Pub/Sub channels
- Rate limiting and API key management
- Concurrency control
- Idempotency and duplicate delivery prevention
- Dead Letter Queues (DLQs)
- Resource-level authorization
- Docker and containerization
- Distributed systems and failure handling

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- Angular CLI
- Docker and Docker Compose
- PostgreSQL (if running outside Docker)
- Redis (if running outside Docker)

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Configure environment variables

Create a `.env` file in the backend directory.

Configure the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

REDIS_HOST="localhost"
REDIS_PORT=6379

JWT_SECRET="your-secret-key"
```

Use appropriate values for your local environment. Never commit actual credentials or secrets.

### 3. Install backend dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

Ensure your PostgreSQL database is configured and the required schema is available before starting the backend.

### 5. Start the Redis service

If using Docker, start your Redis container or the relevant Docker Compose services.

### 6. Start the backend

Run the backend using the development script configured in `package.json`.

### 7. Start the Angular frontend

Navigate to the frontend directory:

```bash
npm install
ng serve
```

The Angular application should now be accessible at:

`http://localhost:4200`

*Note: Update the setup commands and environment variables to match the final repository structure.*

## Screenshots

Add application screenshots here as the UI develops.

| Dashboard | Delivery Attempts |
|---|---|
| Add dashboard screenshot | Add attempts screenshot |

## Project Status

<details>
<summary>Current development status</summary>

This project is actively being developed. The focus is on improving delivery reliability, failure recovery, and observability.

Planned improvements include:

- Enhanced idempotency guarantees
- Dead Letter Queue management
- Manual replay of failed deliveries
- Improved rate-limiting strategies
- Better monitoring and delivery observability

</details>
