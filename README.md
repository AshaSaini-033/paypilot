
# PayPilot

PayPilot is a full-stack payment routing and recovery system built for
the Razorpay AI Buildathon 2026.

The idea is simple: instead of sending every payment through the same
gateway, PayPilot uses GenAI to choose the most suitable gateway based
on its current performance. If the selected gateway fails, the system
automatically tries another healthy gateway.

This project uses simulated payment gateways, so no real money or real
payment transactions are involved.

## What it does

-   Uses GenAI to select a payment gateway.
-   Considers gateway success rate, failure rate, latency, transaction
    fee, and health.
-   Processes payments through simulated gateways.
-   Detects gateway failures.
-   Automatically reroutes a failed payment to another healthy gateway.
-   Stores payment and routing information in MySQL.
-   Shows AI reasoning, confidence, selected gateway, attempts, and
    recovery status in the dashboard.
-   Supports idempotency using an `Idempotency-Key`.

## Architecture

``` text
React Frontend
      |
      v
Node.js + Express Backend
      |
      +--------------------+
      |                    |
      v                    v
MySQL Database        GenAI Service
                           |
                           v
                        Groq API
```

Payment recovery flow:

``` text
Payment Request
      |
      v
GenAI selects Gateway
      |
      v
Gateway processes payment
      |
   Success
      |
      v
   Completed

If it fails:
      |
      v
GenAI selects another healthy gateway
      |
      v
Second attempt
      |
      v
Recovered / Failed
Live Demo: https://paypilot-frontend-9sgf.onrender.com/

## Tech Stack

### Frontend

-   React
-   Vite
-   Axios
-   React Router
-   CSS

### Backend

-   Node.js
-   Express
-   MySQL
-   MySQL2
-   UUID
-   CORS

### GenAI

-   Node.js
-   Express
-   Groq SDK
-   Groq `openai/gpt-oss-20b`

### Database

-   MySQL
-   Aiven MySQL for the deployed version

### Deployment

-   Render for frontend, backend, and GenAI service

## Project Structure

``` text
PayPilot/
├── .github/
├── ai-service/
│   ├── aiRouter.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── initDb.js
│   ├── data/
│   │   └── seedGateways.js
│   ├── middleware/
│   │   └── idempotency.js
│   ├── routes/
│   │   ├── gatewayRoutes.js
│   │   └── paymentRoutes.js
│   ├── services/
│   │   ├── aiRouter.js
│   │   ├── gatewayService.js
│   │   ├── gatewaySimulator.js
│   │   ├── paymentProcessor.js
│   │   └── paymentService.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── database/
├── docs/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── data/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   ├── App.css
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## How GenAI is used

The GenAI service receives the payment information and the currently
healthy gateways.

It is asked to return a routing decision in JSON:

``` json
{
  "recommended_gateway": "Gateway A",
  "reason": "Gateway A provides the best balance of reliability, latency and cost.",
  "confidence": 0.95,
  "action": "ROUTE"
}
```

The backend validates the recommended gateway before processing the
payment.

GenAI does not directly control the payment system. The backend keeps
the final safety checks and only allows healthy, active gateways to be
used.

## Gateway simulation

The project currently uses three simulated gateways:

  Gateway       Success Rate   Avg. Latency   Transaction Fee
  ----------- -------------- -------------- -----------------
  Gateway A            97.8%         180 ms             ₹2.00
  Gateway B            91.2%         120 ms             ₹1.00
  Gateway C            99.1%         310 ms             ₹3.00

These values are intentionally different so the AI has meaningful
trade-offs when choosing a route.

The simulator uses the configured success rate and latency to mimic real
gateway behavior.

## Failure Recovery

PayPilot supports an automatic two-attempt recovery flow.

Example:

``` text
GenAI → Gateway B

Attempt 1
Gateway B → FAILED

GenAI Recovery
        ↓
Gateway A

Attempt 2
Gateway A → SUCCESS

Final Status → RECOVERED
```

For testing, a gateway can be put into forced-failure mode through the
backend gateway endpoint.

## Database

The application creates the required tables automatically when the
backend starts.

Main tables:

### `gateways`

Stores gateway health and performance information.

Important fields include:

-   `success_rate`
-   `failure_rate`
-   `average_latency`
-   `transaction_fee`
-   `circuit_open`
-   `force_failure`

### `payments`

Stores payment and routing information.

Important fields include:

-   `transaction_id`
-   `amount`
-   `payment_method`
-   `initial_gateway`
-   `final_gateway`
-   `status`
-   `attempts`
-   `recovered`
-   `ai_reason`
-   `ai_confidence`
-   `ai_action`

## Running locally

### 1. Clone the repository

``` bash
git clone https://github.com/AshaSaini-033/paypilot.git
cd paypilot
```

### 2. Backend

``` bash
cd backend
npm install
npm run dev
```

The backend runs on:

``` text
http://localhost:8080
```

### 3. GenAI service

Open another terminal:

``` bash
cd ai-service
npm install
npm run dev
```

The GenAI service runs on:

``` text
http://localhost:5000
```

### 4. Frontend

Open another terminal:

``` bash
cd frontend
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Environment Variables

Do not commit API keys, database passwords, or other secrets to GitHub.

### Backend

``` env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
PORT=8080
AI_SERVICE_URL=http://localhost:5000
```

For deployment, `AI_SERVICE_URL` should point to the deployed GenAI
service.

### GenAI Service

``` env
GROQ_API_KEY=
PORT=5000
```

For Render, use the environment variable settings in the Render
dashboard rather than committing `.env` files.

### Frontend

The frontend should point to the deployed backend API:

``` text
https://<your-backend-url>/api
```

## API Overview

### Payments

``` text
GET    /api/payments
GET    /api/payments/:id
POST   /api/payments
```

### Gateways

``` text
GET    /api/gateways
GET    /api/gateways/:id
PATCH  /api/gateways/:id/failure
```

### GenAI

``` text
POST /api/ai/route
```

## Idempotency

Payment creation supports an `Idempotency-Key` header.

If the same key is sent again, the backend can identify the existing
transaction instead of creating a duplicate payment.

Example:

``` text
Idempotency-Key: demo-payment-001
```

This is useful for preventing accidental duplicate payment requests when
a client retries a request.

## Deployment

The deployed setup uses three Render services:

``` text
Frontend
   ↓
Backend
   ↓
GenAI Service
   ↓
Groq
```

The backend connects to the Aiven MySQL database.

Before deploying, make sure:

1.  Backend environment variables are configured.
2.  `AI_SERVICE_URL` points to the deployed GenAI service.
3.  GenAI service has a valid `GROQ_API_KEY`.
4.  Frontend points to the deployed backend API.
5.  Secrets are not committed to GitHub.

## Demo Flow

A simple demo can be run like this:

1.  Open the PayPilot dashboard.
2.  Create a payment.
3.  Show the AI-selected gateway.
4.  Open the transaction details.
5.  Show the AI explanation and confidence.
6.  Enable forced failure for a gateway when demonstrating recovery.
7.  Create another payment.
8.  Show the first failed attempt.
9.  Show GenAI selecting another healthy gateway.
10. Show the payment being recovered successfully.

## Why PayPilot?

Traditional payment routing can rely on fixed rules or a single
preferred gateway. PayPilot adds a GenAI decision layer that can
evaluate several gateway attributes together and explain why a
particular route was selected.

The main focus of the project is not simply making a payment. It is
making the routing decision visible, explainable, and recoverable when a
gateway fails.

## Disclaimer

This is a buildathon/demo project using simulated payment gateways. It
is not connected to real payment processing and should not be used to
process real financial transactions.
<img width="1911" height="916" alt="image" src="https://github.com/user-attachments/assets/b9634313-83b5-49db-9fcf-3af536d3cf3b" />
<img width="1898" height="910" alt="image" src="https://github.com/user-attachments/assets/feda93b9-2898-4b1f-84b9-04a905f13517" />
<img width="1917" height="912" alt="image" src="https://github.com/user-attachments/assets/493e1cbc-c6e9-46fd-b631-50076a27bd15" />
<img width="1903" height="912" alt="image" src="https://github.com/user-attachments/assets/05aa97bd-b183-4aa4-85d5-877192a16a75" />
<img width="1917" height="896" alt="image" src="https://github.com/user-attachments/assets/06eaa0c1-4b8e-4e8a-a922-62d283aa7488" />
<img width="1907" height="832" alt="image" src="https://github.com/user-attachments/assets/2dc663d4-46bf-441c-949b-8ef1261416ef" />





