// EASY-TRACABILITY:frontend/src/features/manager/components/ManagerLayout.tsx

import { useLocation, Outlet } from "react-router-dom";
import { SidebarProvider } from "../../../components/ui/SidebarContext";
import { Sidebar } from "../../../components/ui/Sidebar/Sidebar";
import { TopBar } from "../../../components/ui/TopBar/TopBar";
import "../../../../src/layouts/layout.css";

// Mapping des routes manager → titres dynamiques
const TITLE_MAP: Record<string, string> = {
  "/manager": "Dashboard",
  "/manager/products": "Produits",
  "/manager/movements": "Mouvements",
  "/manager/transactions": "Transactions",
  "/manager/statistics": "Statistiques",
};

const ManagerLayout = () => {
  const { pathname } = useLocation();

  const baseTitle =
    TITLE_MAP[pathname] ??
    TITLE_MAP[pathname.replace(/\/$/, "")] ??
    "Manager Dashboard";

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

export default ManagerLayout;
