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


---

## 🧰 Full Setup Guide: How to Reuse and Develop the Project Efficiently

This section provides a **complete developer guide** to install, configure, and extend the Easy Traçability project.

---

### 🧑‍💻 Prerequisites

Before you begin, make sure you have:

- **Node.js** (>= 18.x)
- **npm** or **yarn**
- **MySQL** (local or cloud instance)
- **Redis** (for session management)
- **Git** installed
- Recommended: **VS Code** with these extensions:
  - ESLint
  - Prettier
  - GitLens
  - Docker (optional, for future containerization)

---

### 📁 Project Structure

```bash
easy-tracability/
├── backend/           # Node.js + Express API
│   ├── src/
│   ├── .env.example
│   └── package.json
├── frontend/          # React.js + TypeScript app
│   ├── src/
│   ├── public/
│   └── package.json
├── README.md
└── .github/workflows/ci.yml
```

---

### 🔧 Backend Setup (Express + Sequelize)

1. Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

2. Create and configure your environment file:

```bash
cp .env.example .env
```

Add values to:

```dotenv
DB_URL=mysql://username:password@localhost:3306/easydb
SESSION_SECRET=yourSecret
REDIS_URL=redis://localhost:6379
```

3. Initialize the database (MySQL):

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

4. Run the backend server:

```bash
npm run dev
```

---

### 💻 Frontend Setup (React + TypeScript + DevExtreme)

1. Navigate to the frontend folder and install dependencies:

```bash
cd ../frontend
npm install
```

2. Run the frontend app:

```bash
npm run dev
```

The app will run at `http://localhost:3000`.

---

### 🧩 Key Dependencies

#### Backend

| Package          | Purpose                              |
|------------------|--------------------------------------|
| express          | Web server                           |
| sequelize        | ORM for MySQL                        |
| mysql2           | MySQL driver                         |
| express-session  | Session handling                     |
| connect-redis    | Redis store for sessions             |
| helmet           | Security headers                     |
| cors             | Cross-origin resource sharing        |
| jsonwebtoken     | Authentication (JWT)                 |
| dotenv           | Environment variables                |
| jest + supertest | Testing (unit + integration)         |

#### Frontend

| Package           | Purpose                                |
|-------------------|----------------------------------------|
| react             | Core frontend library                  |
| react-router-dom  | Routing                                |
| axios             | HTTP requests                          |
| devextreme/react  | UI components (DataGrid, Charts, etc.)|
| zod or yup        | Form validation                        |
| react-hook-form   | Form management                        |
| eslint/prettier   | Code linting and formatting            |
| vite              | Fast dev server (or Create React App) |

---

### ✅ Dev Best Practices

- Use ESLint and Prettier for consistent code formatting.
- Commit frequently with meaningful messages.
- Use GitHub Projects or Jira for task management.
- Add TypeScript interfaces/types for all entities and API responses.
- Document each new feature in the `README.md`.

---

### 🧪 Run Tests

Backend:

```bash
npm run test
```

Frontend:

```bash
npm run test
```

Continuous Integration (CI) with GitHub Actions is already configured in `.github/workflows/ci.yml`.

---

### 🚀 Deployment Tips

- Use **Netlify** or **Vercel** for frontend.
- Deploy backend on **Heroku**, **Render**, or **AWS Elastic Beanstalk**.
- Use **ClearDB** or **PlanetScale** for MySQL in production.
- Use **Redis Cloud** (free tier available).

---

## 🧱 Recommended Folder Enhancements

- `/frontend/hooks/` → for custom React hooks
- `/frontend/services/` → for API abstraction
- `/backend/middleware/` → for auth, error handling
- `/backend/controllers/` → for route logic
- `/backend/models/` → Sequelize models
- `/backend/routes/` → Express route definitions

---

## 📘 Developer Notes

- Diagrams used: Use Lucidchart or Draw.io for updating UML and ER diagrams.
- All roles (Admin, Manager, Operator) are managed with `role` field in the `User` table.
- Barcode generation uses the Code128 standard.
- Data can be exported in CSV or PDF (future enhancement).

---

Now you're all set to reuse, extend and deploy the Easy Traçability system 🎉
