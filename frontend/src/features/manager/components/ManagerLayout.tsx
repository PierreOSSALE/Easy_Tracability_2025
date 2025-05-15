// EASY-TRACABILITY:frontend/src/features/manager/components/ManagerLayout.tsx

import { SidebarProvider } from "../../../components/ui/SidebarContext";
import { Sidebar } from "../../../components/ui/Sidebar/Sidebar";
import { TopBar } from "../../../components/ui/TopBar/TopBar";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => (
  <SidebarProvider>
    <div
      className="layout"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 1. Sidebar à gauche */}
      <Sidebar />

      {/* 2. Colonne principale (TopBar + contenu) */}
      <div
        className="main-column"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          position: "relative",
        }}
      >
        {/* 2a. TopBar */}
        <TopBar title="Manager Dashboard" />
        {/* 2b. Contenu chargé par react-router */}
        <main
          className="content"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            marginTop: "60px", // correspond à la hauteur de la TopBar
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default ManagerLayout;
