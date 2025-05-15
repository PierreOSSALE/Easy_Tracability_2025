// EASY-TRACABILITY:frontend/src/features/operator/components/OperatorLayout.tsx
import { SidebarProvider } from "../../../components/ui/SidebarContext";
import { Sidebar } from "../../../components/ui/Sidebar/Sidebar";
import { TopBar } from "../../../components/ui/TopBar/TopBar";
import { Outlet } from "react-router-dom";

const OperatorLayout = () => (
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
        <TopBar title="Operator Dashboard" />
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

export default OperatorLayout;
