# Easy_Tracability_2025
Comprehensive solution for coding, stock management, and product traceability for merchants, incorporating IoT tools and an interactive dashboard.

---

## 📚 Table of Contents

- [🧭 Introduction](#-introduction)
- [🛠️ Features](#️-features)
- [📦 Technologies](#-technologies)
- [📥 Installation](#-installation)
- [🚀 Usage](#-usage)
- [⚙️ Configuration](#️-configuration)
- [🧪 Testing](#-testing)
- [📊 Example Usage](#-example-usage)
- [🚧 Troubleshooting](#-troubleshooting)
- [👨‍💻 Contributors](#-contributors)
- [📝 License](#-license)

---

## 🧭 Introduction

**Easy Traçability** is a web application designed to simplify **inventory management, logistics tracking, and product traceability** for merchants and supply chain actors.

Through a combination of **barcode printers**, a **mobile terminal**, an **interactive dashboard**, and a **secure backend**, this solution enables:

- Custom product labeling and barcode generation
- Real-time data collection and synchronization
- Centralized management of stock, sales, and purchases

---

## 🛠️ Features

### ✅ Core Features

- 🧾 **Labeling & Encoding**: Generate and print custom Code128 barcodes.
- 📲 **Data Collection**: Scan via simulated terminal or manual entry.
- 📦 **Inventory Management**: Track entries/exits, critical thresholds, and alerts.
- 🔒 **Secure Transmission**: Secure REST API with JWT & TLS encryption.
- 📈 **Reporting**: React.js dashboard with DevExtreme charts.
- 🧪 **Testing**: Unit and integration testing with Jest and Supertest.

### 🕗 Future Enhancements

- ERP and real IoT integration
- Advanced logistics optimization
- Offline mode and enhanced reporting

---

## 📦 Technologies

| Layer         | Tools/Libraries                                  |
|---------------|--------------------------------------------------|
| Frontend      | React.js + TypeScript + DevExtreme               |
| Backend       | Node.js + Express + Sequelize                    |
| Database      | MySQL                                            |
| Authentication| JWT, TLS, Helmet, express-session (Redis)       |
| Testing       | Jest, Supertest                                  |
| CI/CD         | GitHub Actions                                   |
| Modeling      | UML, ER diagrams (Draw.io, Lucidchart)           |
| Deployment    | Netlify (frontend), Heroku/AWS (backend, Redis)  |

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/easy-tracability.git
cd easy-tracability
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

> Fill in the required environment variables (`DB_URL`, `SESSION_SECRET`, etc.)

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## 🚀 Usage

### Run in Development Mode

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

> The frontend will be accessible at `http://localhost:3000`

---

## ⚙️ Configuration

Environment variables are defined in `.env`. Example:

```dotenv
DB_URL=mysql://user:password@localhost:3306/easydb
SESSION_SECRET=yourSecret
REDIS_URL=redis://localhost:6379
```

---

## 🧪 Testing

Run tests using:

```bash
# Backend
npm run test

# Frontend (if applicable)
npm run test
```

Tests included:

- ✅ Unit tests with Jest
- ✅ Integration tests with Supertest
- ✅ CI/CD with GitHub Actions (`.github/workflows/ci.yml`)

---

## 📊 Example Usage

- 🔐 **Login**: Authenticate based on role (Admin, Manager, Operator)
- 📇 **Scan Product**: Use mobile interface to scan a barcode
- 📈 **Dashboard**: View product activity, stock levels, and statistics

---

## 🚧 Troubleshooting

| Issue                            | Solution                                               |
|----------------------------------|--------------------------------------------------------|
| `Error: Cannot connect to DB`    | Check the DB connection string in `.env`              |
| `CORS Error`                     | Enable `withCredentials` on frontend API calls        |
| Barcode printing not working     | Check printer configuration and network port          |
| Scan not working                 | Use manual entry fallback                             |

---

## 👨‍💻 Contributors

- **Student Name** – Full Stack Developer
- [Supervisor / Technical Mentor]

---

## 📝 License

This project is licensed under the **MIT License**. See `LICENSE.md` for more details.
