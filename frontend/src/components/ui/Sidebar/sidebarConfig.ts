// EASY-TRACABILITY:frontend/src/components/ui/Sidebar/sidebarConfig.ts

import { NavigationItem } from "./types";

export interface SidebarSection {
  title?: string;
  items: NavigationItem[];
}

export interface SidebarConfig {
  navItems: Record<string, SidebarSection[]>;
  logos: {
    top: string;
    bottom: string;
  };
}

export const sidebarConfig: SidebarConfig = {
  navItems: {
    Admin: [
      {
        items: [{ icon: "home", label: "Dashboard" }],
      },
      {
        items: [
          { icon: "group", label: "Users" },
          { icon: "product", label: "Products" },
          { icon: "repeat", label: "Movements" },
        ],
      },
      {
        items: [{ icon: "chart", label: "Statistics" }],
      },
      {
        items: [{ icon: "preferences", label: "Settings" }],
      },
    ],
    Manager: [
      {
        title: "Vue d'ensemble",
        items: [{ icon: "home", label: "Dashboard" }],
      },
      {
        title: "Stock & Produits",
        items: [
          { icon: "product", label: "Products" },
          { icon: "repeat", label: "Movements" },
        ],
      },
      {
        title: "Suivi Transactions",
        items: [{ icon: "money", label: "Transactions" }],
      },
      {
        title: "Analyse",
        items: [{ icon: "chart", label: "Statistics" }],
      },
    ],
    Operator: [
      {
        title: "Vue d'ensemble",

        items: [{ icon: "home", label: "Dashboard" }],
      },
      {
        title: "Ajout de Mouvement",

        items: [{ icon: "add", label: "New Movement" }],
      },
    ],
  },
  logos: {
    top: "/logo2.png",
    bottom: "/logo-easy-tracability.png",
  },
};
