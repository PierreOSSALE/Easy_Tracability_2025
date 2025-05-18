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
import SettingsPage from "../features/admin/pages/SettingsPage";

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
              path: "statistics",
              element: <StatisticsPage />,
              handle: { title: "Statistiques" },
            },
            {
              path: "settings",
              element: <SettingsPage />,
              handle: { title: "Paramètres" },
            },
          ],
        },
      ],
    },

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
              handle: { title: "Products" },
            },
            {
              path: "movements",
              element: <ManagerMovementsPage />,
              handle: { title: "Movements" },
            },
            {
              path: "transactions",
              element: <ManagerTransactionsPage />,
              handle: { title: "Transactions" },
            },
            {
              path: "statistics",
              element: <ManagerStatisticsPage />,
              handle: { title: "Statistics" },
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
