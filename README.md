# Production-Ready Microservice Architecture with NestJS

This project is a robust, scalable, and production-ready microservice architecture built with the [NestJS](https://nestjs.com/) framework. The goal is to provide a complete boilerplate and foundation for rapidly developing complex applications by having all the essential infrastructure pre-implemented.

The architecture features asynchronous communication between services via **Redis**, data persistence with **MongoDB**, and an **API Gateway** as a centralized entry point.

## ✨ Core Features

This isn't just a simple app; it's a complete framework featuring:

- **Microservice Architecture:** Complete separation of concerns into independent services (`users-service`, `auth-service`) for maximum scalability and maintainability.
- **Asynchronous Communication:** Utilizes **Redis** as a powerful and reliable message broker for asynchronous communication between services.
- **API Gateway Pattern:** A single entry point (`api-gateway`) responsible for routing, initial validation, and distributing requests to the appropriate microservices.
- **Centralized & Secure Authentication:** A dedicated `auth-service` that handles token issuance and validation in isolation using **JWT (JSON Web Tokens)** and the `Passport.js` mechanism.
- **Advanced & Dynamic Rate Limiting:**
    - A smart, global guard that automatically distinguishes between authenticated users (tracking by User ID) and guests (tracking by IP address).
    - Ability to define multiple, named throttling rules (e.g., short-term burst control and long-term throttling).
    - Support for dynamic limits based on user plans (e.g., `free` vs. `premium`) read from the JWT payload.
- **Structured & Production-Ready Logging:** Uses **Winston** for structured, JSON-formatted, production-grade logging, complete with a `LoggingInterceptor` that automatically logs all request/response details.
- **Centralized Exception Handling:** A global `AllExceptionsFilter` that gracefully catches all application errors (both HTTP and `RpcException` from microservices) and returns a standardized, clean error response.
- **Shared Common Library (`@app/common`):** A dedicated library to enforce the DRY principle by sharing modules, DTOs, guards, and other common utilities across all services.
- **Environment-based Configuration:** Utilizes per-service `.env` files with `Joi` validation to prevent the application from starting with an incomplete or invalid configuration.
- **Fully Dockerized:** The entire architecture (including all services, MongoDB, and Redis) is containerized and orchestrated with a single `docker-compose up` command.

## 🏗️ Architecture Overview

```
+----------------+   (HTTP Request)   +-----------------+   (Message via Redis)   +------------------+   (CRUD)   +-----------+
|                | -----------------> |                 | ----------------------> |                  | <--------> |           |
|  Client (Web/  |                    |   API Gateway   |                         |   Users Service  |            |  MongoDB  |
|     Mobile)    | <----------------- |                 | <---------------------- |                  | <--------> |           |
|                |   (HTTP Response)  |                 |   (Response via Redis)  |------------------+            +-----------+
+----------------+                    +-------+---------+                         |                  |
                                            |                                   |   Auth Service   |
                                            | (Message via Redis)               |                  |
                                            +---------------------------------> +------------------+
```

## 🛠️ Technology Stack

- **Core Framework:** [NestJS](https://nestjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Message Broker:** [Redis](https://redis.io/)
- **Containerization:** [Docker](https://www.docker.com/) & Docker Compose
- **Authentication:** [Passport.js](http://www.passportjs.org/) (JWT Strategy)
- **Logging:** [Winston](https://github.com/winstonjs/winston)
- **Validation:** [Joi](https://joi.dev/) & `class-validator`

## 🚀 Getting Started

To run this project locally, you will need **Node.js (v18 or higher)** and **Docker** installed on your machine.

**1. Clone the Repository:**

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

**2. Install Dependencies:**

```bash
npm install
```

**3. Create Environment Files (`.env`):**
You must create three separate `.env` files in the specified paths.

- **`apps/api-gateway/.env`:**

    ```env
    API_GATEWAY_PORT=3000
    REDIS_HOST=redis
    REDIS_PORT=6379
    # This secret MUST be the same as the one in auth-service
    JWT_SECRET=YOUR_SUPER_SECRET_KEY_CHANGE_IT
    ```

- **`apps/users-service/.env`:**

    ```env
    USERS_SERVICE_PORT=3001
    REDIS_HOST=redis
    REDIS_PORT=6379
    USERS_DB_URI=mongodb://mongo:27017/users_db
    ```

- **`apps/auth-service/.env`:**

    ```env
    AUTH_SERVICE_PORT=3002
    REDIS_HOST=redis
    REDIS_PORT=6379
    JWT_SECRET=YOUR_SUPER_SECRET_KEY_CHANGE_IT
    JWT_EXPIRATION=3600s
    ```

**4. Run the Entire Architecture:**
This command will build the Docker images and start all containers.

```bash
docker-compose up --build
```

After a few moments, all services should be up and running.

## 🧪 Usage & Testing

You can use a tool like `curl` or Postman to test the endpoints.

**1. Sign up a new user:**

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"email":"test@example.com", "password":"StrongPassword123"}' \
http://localhost:3000/api/users/sign-up
```

**2. Log in with the new user:**

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"email":"test@example.com", "password":"StrongPassword123"}' \
http://localhost:3000/api/auth/login
```

You will receive an `accessToken` in the response.

## 🗺️ Roadmap & Next Steps

- [ ] **Write Tests:** Add comprehensive Unit, Integration, and E2E tests.
- [ ] **Complete Rate Limiter:** Implement the `fixed-window` logic for monthly quotas.
- [ ] **Add More Services:** Easily extend the architecture with new services (e.g., `products-service`).
- [ ] **Set up CI/CD:** Create a pipeline (e.g., with GitHub Actions) for automated testing and builds.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
