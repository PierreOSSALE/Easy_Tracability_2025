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
        title: "Vue d'ensemble",
        items: [{ icon: "home", label: "Dashboard", path: "/admin" }],
      },
      {
        title: "OLTP",
        items: [
          { icon: "group", label: "Utilisateurs", path: "/admin/users" },
          { icon: "product", label: "Produits", path: "/admin/products" },
          { icon: "repeat", label: "Mouvements", path: "/admin/movements" },
          { icon: "money", label: "Transactions", path: "/admin/transactions" },
        ],
      },
      {
        title: "DW & ETL",
        items: [
          { icon: "preferences", label: "ETL", path: "/admin/etl" },
          { icon: "contentlayout", label: "DataWarehouse", path: "/admin/dw" },
        ],
      },
      {
        title: "Analyse",
        items: [
          {
            icon: "chart",
            label: "Statistiques",
            path: "/admin/statistics",
          },
          {
            icon: "warning",
            label: "Ventes & Alertes",
            path: "/admin/sales-alerts",
          },
        ],
      },
    ],

    Manager: [
      {
        title: "Vue d'ensemble",
        items: [{ icon: "home", label: "Dashboard", path: "/manager" }],
      },
      {
        title: "Stock & Produits",
        items: [
          { icon: "product", label: "Produits", path: "/manager/products" },
          { icon: "repeat", label: "Mouvements", path: "/manager/movements" },
        ],
      },
      {
        title: "Suivi Transactions",
        items: [
          {
            icon: "money",
            label: "Transactions",
            path: "/manager/transactions",
          },
        ],
      },
      {
        title: "Analyse",
        items: [
          { icon: "chart", label: "Statistiques", path: "/manager/statistics" },
        ],
      },
    ],

    Operator: [
      {
        title: "Vue d'ensemble",
        items: [{ icon: "home", label: "Dashboard", path: "/operator" }],
      },
      {
        title: "Opérations",
        items: [
          { icon: "add", label: "New Movement", path: "/operator/newmovement" },
        ],
      },
    ],
  },

  logos: {
    top: "/logo2.png",
    bottom: "/logo-easy-tracability.png",
  },
};
