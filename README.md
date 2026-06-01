<div align="center">

# DevCollab API — High-Performance Core Engine

**The robust backend powering the DevCollab platform.**  
Engineered with Enterprise-Grade design patterns, real-time socket communication, and Clean Architecture.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Stripe](https://img.shields.io/badge/Stripe-Connect-008CDD?logo=stripe&logoColor=white)](https://stripe.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architectural Philosophy](#-architectural-philosophy)
- [Technical Highlights](#-technical-highlights)
- [Tech Stack](#-tech-stack)
- [Deployment & Setup](#-deployment--setup)
- [Frontend Application](#-frontend-application)

---

## 🌟 Overview

**DevCollab Backend** serves as the high-performance backbone of the entire DevCollab ecosystem. It focuses on long-term maintainability, testability, and strict separation of concerns, providing the APIs and real-time socket connections necessary to build modern developer tooling.

---

## 🏗️ Architectural Philosophy

This system implements **Clean Architecture** to strictly decouple business logic from infrastructure frameworks. This ensures that the core domain remains pure and adaptable to technology shifts over time.

```mermaid
graph TD
    classDef domain fill:#f9f,stroke:#333,stroke-width:2px;
    classDef app fill:#bbf,stroke:#333,stroke-width:2px;
    classDef infra fill:#dfd,stroke:#333,stroke-width:2px;

    subgraph Infrastructure ["Infrastructure (External Concerns)"]
        Mongo[MongoDB]
        Redis[Redis Cache]
        Stripe[Stripe API]
        Express[Express Framework]
    end

    subgraph Adapters ["Interface Adapters"]
        Controllers
        Repositories[Repository Impl]
    end

    subgraph Application ["Application Layer (Use Cases)"]
        UseCase[Business Use Cases]
        DTOs
        Ports[Interfaces/Ports]
    end

    subgraph Domain ["Domain Layer (Enterprise Logic)"]
        Entities[Core Entities]
    end

    Infrastructure --> Adapters
    Adapters --> Application
    Application --> Domain
    
    class Domain domain;
    class Application app;
    class Infrastructure infra;
```

### Key Design Decisions
1. **Dependency Injection (InversifyJS)**: All dependencies are injected at runtime, allowing for effortless unit testing and modularity.
2. **Repository Pattern**: The application is agnostic of the database. MongoDB is currently used, but the `IRepository` interfaces allow for swapping to SQL without touching business logic.
3. **DTOs & Mappers**: Strict data contracts ensure that internal database structures are never leaked to the client.

---

## ⚡ Technical Highlights

| System Component | Description |
|------------------|-------------|
| 🌐 **Real-time Event Engine** | Powered by **Socket.io** to handle concurrent connections. Uses room-based partitioning and optimistic concurrency for high-frequency board updates. |
| 🚀 **High-Performance Caching** | Utilizes **Redis** for fast, distributed session handling and caching expensive dashboard aggregations to reduce DB load. |
| 🛡️ **Secure Transactions** | Integrated **Stripe Connect** with custom escrow state machines (Pending -> Held -> Released) and resilient webhook handlers. |

---

## 🛠️ Technology Stack

| Layer | Technology | Usage |
|-------|------------|-------|
| **Runtime** | Node.js / Express | API Gateway & Routing |
| **Language** | TypeScript | Strict Type Safety |
| **Database** | MongoDB + Mongoose | Flexible Document Design |
| **Cache** | Redis | Performance & Pub/Sub |
| **Testing** | Jest | Unit & Integration Testing |
| **DevOps** | Docker | Containerization |

---

## 🚀 Deployment & Setup

### Requirements
- Node.js 20+
- MongoDB instance (Atlas or local)
- Redis instance

### Quick Start
1. **Clone & Install**
   ```bash
   git clone https://github.com/Arunjith5452/DevCollab-Backend.git
   cd DevCollab-Backend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/devcollab
   REDIS_HOST=localhost
   ```

3. **Run Service**
   ```bash
   npm run dev
   ```

---

## 🔗 Client Application
The public face of this API.
👉 **[Explore the Frontend Architecture](https://github.com/Arunjith5452/DevCollab-Frontend)**

<div align="center">
  <strong>Built with strict typing and clean architecture.</strong>
</div>
