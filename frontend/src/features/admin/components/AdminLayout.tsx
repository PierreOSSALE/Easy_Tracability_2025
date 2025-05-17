// EASY-TRACABILITY:frontend/src/features/admin/components/AdminLayout.tsx

import { useLocation, Outlet } from "react-router-dom";
import { SidebarProvider } from "../../../components/ui/SidebarContext";
import { Sidebar } from "../../../components/ui/Sidebar/Sidebar";
import { TopBar } from "../../../components/ui/TopBar/TopBar";
import "../../../../src/layouts/layout.css";

// 1. On définit le mapping chemin → titre
const TITLE_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Utilisateurs",
  "/admin/products": "Produits",
  "/admin/movements": "Mouvements",
  "/admin/statistics": "Statistiques",
  "/admin/secure": "Sécurité",
  "/admin/settings": "Paramètres",
  // ... si vous voulez couvrir manager et operator côté AdminLayout
};

const AdminLayout = () => {
  const { pathname } = useLocation();

  // 2. On prend le titre correspondant ou un fallback
  const baseTitle =
    TITLE_MAP[pathname] ??
    TITLE_MAP[pathname.replace(/\/$/, "")] ??
    "Admin Dashboard";

  // 3. On construit le ReactNode titre + icône
  const titleWithIcon = (
    <>
      {baseTitle}
      <i className="fa-solid fa-angles-right" style={{ marginLeft: 8 }} />
    </>
  );

  return (
    <SidebarProvider>
      <div className="layout">
        {/* 1. Sidebar à gauche */}
        <Sidebar />

        {/* 2. Colonne principale */}
        <div className="mainColumn">
          {/* 2a. TopBar reçoit désormais un ReactNode */}
          <TopBar title={titleWithIcon} />

          {/* 2b. Contenu */}
          <main className="content">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
