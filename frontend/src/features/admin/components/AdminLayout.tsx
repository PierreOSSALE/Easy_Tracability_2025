// EASY-TRACABILITY:frontend/src/features/admin/components/AdminLayout.tsx

import { useLocation, Outlet } from "react-router-dom";
import { SidebarProvider } from "../../../components/ui/SidebarContext";
import { Sidebar } from "../../../components/ui/Sidebar/Sidebar";
import { TopBar } from "../../../components/ui/TopBar/TopBar";
import "../../../../src/layouts/layout.css";

// Mapping des routes admin → titres dynamiques
const TITLE_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Utilisateurs",
  "/admin/products": "Produits",
  "/admin/movements": "Mouvements",
  "/admin/transactions": "Transactions",
  "/admin/statistics": "Statistiques",
  "/admin/etl": "ETL",
  "/admin/dw": "DataWarehouse",
  "/admin/sales-alerts": "Ventes & Alertes",
};

const AdminLayout = () => {
  const { pathname } = useLocation();

  const baseTitle =
    TITLE_MAP[pathname] ??
    TITLE_MAP[pathname.replace(/\/$/, "")] ??
    "Admin Dashboard";

  const titleWithIcon = (
    <>
      {baseTitle}
      <i className="fa-solid fa-angles-right" style={{ marginLeft: 8 }} />
    </>
  );

  return (
    <SidebarProvider>
      <div className="layout">
        {/* Sidebar à gauche */}
        <Sidebar />

        {/* Colonne principale */}
        <div className="mainColumn">
          <TopBar title={titleWithIcon} />
          <main className="content">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
