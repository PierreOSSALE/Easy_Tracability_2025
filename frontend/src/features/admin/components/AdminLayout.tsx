// EASY-TRACABILITY:frontend/src/features/admin/components/AdminLayout.tsx

import { SidebarProvider } from "../../../components/ui/SidebarContext";
import { Sidebar } from "../../../components/ui/Sidebar/Sidebar";
import { TopBar } from "../../../components/ui/TopBar/TopBar";
import { Outlet } from "react-router-dom";
import "../../../../src/layouts/layout.css";

const AdminLayout = () => (
  <SidebarProvider>
    <div className="layout">
      {/* 1. Sidebar à gauche */}
      <Sidebar />

      {/* 2. Colonne principale (TopBar + contenu) */}
      <div className="mainColumn">
        {/* 2a. TopBar */}
        <TopBar title="Admin Dashboard" />

        {/* 2b. Contenu chargé par react-router */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default AdminLayout;
