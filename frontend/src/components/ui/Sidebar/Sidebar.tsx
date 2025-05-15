// EASY-TRACABILITY:frontend/src/components/ui/Sidebar/Sidebar.tsx

import { useSidebar } from "../SidebarContext";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import styles from "./Sidebar.module.css";
import { Button } from "devextreme-react/button";
import { useAuthContext } from "../../../features/auth/hooks/useAuthContext";
import { sidebarConfig } from "./sidebarConfig";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const { isOpen, toggleSidebar, setSidebarState } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const roleKey = user?.role || "Admin";
  const rolePath = roleKey.toLowerCase();
  const sections = sidebarConfig.navItems[roleKey] || [];
  const topLogo = sidebarConfig.logos.top;
  const bottomLogo = isOpen
    ? sidebarConfig.logos.bottom
    : sidebarConfig.logos.top;

  const onNavigate = (route: string) => {
    navigate(`/${rolePath}/${route === "dashboard" ? "" : route}`);
    if (isMobile) setSidebarState(false);
  };

  return (
    <>
      {/* Sidebar fixe (desktop toujours, mobile seulement si ouvert) */}
      {(!isMobile || isOpen) && (
        <div
          className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
        >
          <div className={styles.header}>
            {isOpen ? (
              <>
                {/* Expanded state: show logo + collapse chevron */}
                <img src={topLogo} alt="Logo top" className={styles.logoTop} />
                <Button
                  icon="chevrondoubleleft"
                  onClick={toggleSidebar}
                  stylingMode="outlined"
                  className={styles.toggleButton}
                />
              </>
            ) : (
              /* Collapsed state: always show ☰ button */
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
                  {sec.items.map((it, j) => {
                    const route = it.label.toLowerCase().replace(/\s+/g, "");
                    return (
                      <li key={j}>
                        <Button
                          icon={it.icon}
                          text={isOpen ? it.label : ""}
                          hint={!isOpen ? it.label : undefined}
                          stylingMode="text"
                          onClick={() => onNavigate(route)}
                        />
                      </li>
                    );
                  })}
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

      {/* Drawer overlay mobile full-text (quand ouvert) */}
      {isMobile && isOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setSidebarState(false)}
          />
          <div className={`${styles.drawer} ${styles.open}`}>
            <div className={styles.header}>
              {/* uniquement chevron fermeture */}
              <Button
                icon="chevrondoubleleft"
                onClick={toggleSidebar}
                stylingMode="outlined"
                className={styles.toggleButton}
              />
            </div>
            <div className={styles.menu}>
              {sections.map((sec, i) => (
                <div key={i}>
                  <ul className={styles.menuSection}>
                    {sec.items.map((it, j) => (
                      <li key={j}>
                        <Button
                          icon={it.icon}
                          text={it.label}
                          stylingMode="text"
                          onClick={() =>
                            onNavigate(
                              it.label.toLowerCase().replace(/\s+/g, "")
                            )
                          }
                        />
                      </li>
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
        </>
      )}

      {/* Bouton ☰ fixe en mobile quand sidebar fermée */}
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
