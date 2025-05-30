// EASY-TRACABILITY:frontend/src/routes/app.routes.tsx

import React from "react";
import { useRoutes, Navigate } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import RoleProtectedRoute from "./roleProtected.route";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";

// Layouts
import AdminLayout from "../features/admin/components/AdminLayout";
import ManagerLayout from "../features/manager/components/ManagerLayout";
import OperatorLayout from "../features/operator/components/OperatorLayout";

// Admin pages
import DashboardPage from "../features/admin/pages/DashboardPage";
import UsersPage from "../features/admin/pages/UsersPage";
import ProductsPage from "../features/admin/pages/ProductsPage";
import MovementsPage from "../features/admin/pages/MovementsPage";
import StatisticsPage from "../features/admin/pages/StatisticsPage";
import TransactionsPage from "../features/admin/pages/TransactionsPage";

// **Nouvelles pages Admin**
import EtlPage from "../features/admin/pages/EtlPage";
import DwPage from "../features/admin/pages/DwPage";
import SalesAlertsPage from "../features/admin/pages/SalesAlertsPage";

// Manager pages
import ManagerDashboardPage from "../features/manager/pages/ManagerDashboardPage";
import ManagerProductsPage from "../features/manager/pages/ManagerProductsPage";
import ManagerMovementsPage from "../features/manager/pages/ManagerMovementsPage";
import ManagerTransactionsPage from "../features/manager/pages/ManagerTransactionsPage";
import ManagerStatisticsPage from "../features/manager/pages/ManagerStatisticsPage";

// Operator pages
import OperatorDashboardPage from "../features/operator/pages/OperatorDashboardPage";
import OperatorNewMovementPage from "../features/operator/pages/OperatorNewMovementPage";

const AppRoutes: React.FC = () => {
  const routes = useRoutes([
    { path: "/", element: <Navigate to="/login" /> },
    { path: "/login", element: <LoginPage />, handle: { title: "Connexion" } },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
      handle: { title: "Mot de passe oublié" },
    },
    {
      path: "/reset-password/:token",
      element: <ResetPasswordPage />,
      handle: { title: "Réinitialiser le mot de passe" },
    },

    // --- ADMIN ROUTES ---
    {
      path: "/admin",
      element: <RoleProtectedRoute />,
      children: [
        {
          path: "",
          element: <AdminLayout />,
          children: [
            {
              index: true,
              element: <DashboardPage />,
              handle: { title: "Dashboard" },
            },
            {
              path: "users",
              element: <UsersPage />,
              handle: { title: "Utilisateurs" },
            },
            {
              path: "products",
              element: <ProductsPage />,
              handle: { title: "Produits" },
            },
            {
              path: "movements",
              element: <MovementsPage />,
              handle: { title: "Mouvements" },
            },
            {
              path: "transactions",
              element: <TransactionsPage />,
              handle: { title: "Transactions" },
            },
            { path: "etl", element: <EtlPage />, handle: { title: "ETL" } },
            {
              path: "dw",
              element: <DwPage />,
              handle: { title: "DataWarehouse" },
            },
            {
              path: "statistics",
              element: <StatisticsPage />,
              handle: { title: "Statistiques" },
            },
            {
              path: "sales-alerts",
              element: <SalesAlertsPage />,
              handle: { title: "Ventes & Alertes" },
            },
          ],
        },
      ],
    },

    // --- MANAGER ROUTES ---
    {
      path: "/manager",
      element: <RoleProtectedRoute />,
      children: [
        {
          path: "",
          element: <ManagerLayout />,
          children: [
            {
              index: true,
              element: <ManagerDashboardPage />,
              handle: { title: "Dashboard" },
            },
            {
              path: "products",
              element: <ManagerProductsPage />,
              handle: { title: "Produits" },
            },
            {
              path: "movements",
              element: <ManagerMovementsPage />,
              handle: { title: "Mouvements" },
            },
            {
              path: "transactions",
              element: <ManagerTransactionsPage />,
              handle: { title: "Transactions" },
            },
            {
              path: "statistics",
              element: <ManagerStatisticsPage />,
              handle: { title: "Statistiques" },
            },
            {
              path: "*",
              element: <UnauthorizedPage />,
              handle: { title: "Non autorisé" },
            },
          ],
        },
      ],
    },

    // --- OPERATOR ROUTES ---
    {
      path: "/operator",
      element: <RoleProtectedRoute />,
      children: [
        {
          path: "",
          element: <OperatorLayout />,
          children: [
            {
              index: true,
              element: <OperatorDashboardPage />,
              handle: { title: "Dashboard" },
            },
            {
              path: "newmovement",
              element: <OperatorNewMovementPage />,
              handle: { title: "New Movement" },
            },
            {
              path: "*",
              element: <UnauthorizedPage />,
              handle: { title: "Non autorisé" },
            },
          ],
        },
      ],
    },

    // Fallbacks
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
      handle: { title: "Non autorisé" },
    },
    {
      path: "*",
      element: <UnauthorizedPage />,
      handle: { title: "Non autorisé" },
    },
  ]);
  return routes;
};

export default AppRoutes;
