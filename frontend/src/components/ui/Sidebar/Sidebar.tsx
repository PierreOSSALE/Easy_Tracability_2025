// EASY-TRACABILITY:frontend/src/components/ui/Sidebar/Sidebar.tsx

import React from "react";
import { useSidebar } from "../SidebarContext";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import styles from "./Sidebar.module.css";
import { Button } from "devextreme-react/button";
import { useAuthContext } from "../../../features/auth/hooks/useAuthContext";
import { sidebarConfig } from "./sidebarConfig";
import { useNavigate } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar, setSidebarState } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const roleKey = user?.role || "Admin";
  const sections = sidebarConfig.navItems[roleKey] || [];
  const topLogo = sidebarConfig.logos.top;
  const bottomLogo = isOpen
    ? sidebarConfig.logos.bottom
    : sidebarConfig.logos.top;

  const onNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setSidebarState(false);
  };

  const renderItem = (it: { icon: string; label: string; path?: string }) => (
    <Button
      icon={it.icon}
      text={isOpen ? it.label : ""}
      hint={!isOpen ? it.label : undefined}
      stylingMode="text"
      onClick={() => it.path && onNavigate(it.path)}
    />
  );

  return (
    <>
      {(!isMobile || isOpen) && (
        <div
          className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
        >
          <div className={styles.header}>
            {isOpen ? (
              <>
                <img src={topLogo} alt="Logo top" className={styles.logoTop} />
                <Button
                  icon="chevrondoubleleft"
                  onClick={toggleSidebar}
                  stylingMode="outlined"
                  className={styles.toggleButton}
                />
              </>
            ) : (
              <Button
                text="☰"
                onClick={toggleSidebar}
                stylingMode="outlined"
                className={styles.headerToggle}
              />
            )}
          </div>

          <div className={styles.menu}>
            {sections.map((sec, i) => (
              <div key={i}>
                <ul className={styles.menuSection}>
                  {sec.items.map((it, j) => (
                    <li key={j}>{renderItem(it)}</li>
                  ))}
                </ul>
                {i < sections.length - 1 && (
                  <div className={styles.separator} />
                )}
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <img
              src={bottomLogo}
              alt="Logo bottom"
              className={styles.logoBottom}
            />
          </div>
        </div>
      )}

      {isMobile && isOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setSidebarState(false)}
          />
          <div className={`${styles.drawer} ${styles.open}`}>...</div>
        </>
      )}

      {isMobile && !isOpen && (
        <Button
          text="☰"
          onClick={toggleSidebar}
          stylingMode="outlined"
          className={styles.mobileToggle}
        />
      )}
    </>
  );
};
