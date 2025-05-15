// EASY-TRACABILITY:frontend/src/routes/RoleProtectedRoute.tsx

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../features/auth/hooks/useAuthContext";

const RoleProtectedRoute: React.FC = () => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  // console.log("[RoleProtectedRoute] render", {
  //   user,
  //   loading,
  //   pathname: location.pathname,
  // });

  if (loading) {
    return <div>Vérification en cours…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  const map: Record<string, string> = {
    Admin: "/admin",
    Manager: "/manager",
    Operator: "/operator",
  };
  const base = map[user.role] || "/";
  if (!location.pathname.startsWith(base)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default RoleProtectedRoute;
