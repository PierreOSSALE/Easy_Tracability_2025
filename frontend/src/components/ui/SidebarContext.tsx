// EASY-TRACABILITY:frontend/src/components/ui/SidebarContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebarState: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  // ouverture par défaut en fonction de la largeur initiale
  const isDesktop = window.innerWidth >= 768;
  const [isOpen, setIsOpen] = useState(isDesktop);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const setSidebarState = (open: boolean) => setIsOpen(open);

  useEffect(() => {
    // On crée le MediaQueryList pour 768px
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => {
      // e.matches=true <=> on est en mobile, donc fermer ; sinon ouvrir
      setIsOpen(!e.matches);
    };
    // écouter les changements
    mql.addEventListener("change", handler);
    // cleanup
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, setSidebarState }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
};
