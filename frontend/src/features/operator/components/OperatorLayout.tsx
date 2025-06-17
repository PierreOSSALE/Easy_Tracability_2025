// EASY-TRACABILITY:frontend/src/features/operator/components/OperatorLayout.tsx

import { useLocation, Outlet } from "react-router-dom";
import { SidebarProvider } from "../../../components/ui/SidebarContext";
import { Sidebar } from "../../../components/ui/Sidebar/Sidebar";
import { TopBar } from "../../../components/ui/TopBar/TopBar";
import "../../../../src/layouts/layout.css";

// Mapping chemin → libellé
const TITLE_MAP: Record<string, string> = {
  "/operator": "operator dashboard",
  "/operator/newmovement": "new mouvement",
};

const OperatorLayout = () => {
  const { pathname } = useLocation();
  const baseTitle =
    TITLE_MAP[pathname] ??
    TITLE_MAP[pathname.replace(/\/$/, "")] ??
    "Operator Dashboard";

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

export default OperatorLayout;
