// EASY-TRACABILITY:frontend/src/components/ui/TopBar/TopBar.tsx

// EASY-TRACABILITY:frontend/src/components/ui/TopBar/TopBar.tsx

import "./TopBar.css";
import { Button } from "devextreme-react/button";
import { useAuthContext } from "../../../features/auth/hooks/useAuthContext";
import { useSidebar } from "../SidebarContext";
import { ReactNode } from "react";

interface TopBarProps {
  title: ReactNode; // on passe de `string` à `ReactNode`
}

export const TopBar = ({ title }: TopBarProps) => {
  const { user } = useAuthContext();
  const { isOpen } = useSidebar();

  // largeur de la sidebar (collapsed=64, expanded=193)
  const sidebarWidth = isOpen ? 193 : 64;

  return (
    <div
      className="topbar"
      style={{
        marginLeft: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
      }}
    >
      <div className="topbar-left">
        {/* Affichage de notre ReactNode (texte + icône) */}
        <span className="title">{title}</span>
      </div>
      <div className="topbar-right">
        <Button icon="bell" stylingMode="text" />
        <div className="user-info">
          <img
            src={user?.profilePicture || "/default-avatar.png"}
            alt="avatar"
            className="avatar"
          />
          <div className="user-meta">
            <span className="username">{user?.username || "Utilisateur"}</span>
            <span className="role">{user?.role || "Role"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
