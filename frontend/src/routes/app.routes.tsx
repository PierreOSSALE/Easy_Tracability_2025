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
import SecurePage from "../features/admin/pages/SecurePage";
import SettingsPage from "../features/admin/pages/SettingsPage";
// Manager pages
import ManagerDashboardPage from "../features/manager/pages/ManagerDashboardPage";
// Operator pages
import OperatorDashboardPage from "../features/operator/pages/OperatorDashboardPage";

const AppRoutes: React.FC = () => {
  const routes = useRoutes([
    { path: "/", element: <Navigate to="/login" /> },

    { path: "/login", element: <LoginPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/reset-password/:token", element: <ResetPasswordPage /> },

    {
      path: "/admin",
      element: <RoleProtectedRoute />,
      children: [
        {
          path: "",
          element: <AdminLayout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "users", element: <UsersPage /> },
            { path: "products", element: <ProductsPage /> },
            { path: "movements", element: <MovementsPage /> },
            { path: "statistics", element: <StatisticsPage /> },
            { path: "secure", element: <SecurePage /> },
            { path: "settings", element: <SettingsPage /> },
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
            { index: true, element: <ManagerDashboardPage /> },
            { path: "*", element: <UnauthorizedPage /> },
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
            { index: true, element: <OperatorDashboardPage /> },
            { path: "*", element: <UnauthorizedPage /> },
          ],
        },
      ],
    },

    { path: "/unauthorized", element: <UnauthorizedPage /> },
    { path: "*", element: <UnauthorizedPage /> },
  ]);

  return routes;
};

export default AppRoutes;
