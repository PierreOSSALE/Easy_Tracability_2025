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
        items: [
          { icon: "lock", label: "Secure" },
          { icon: "preferences", label: "Settings" },
        ],
      },
    ],
    Manager: [
      {
        items: [{ icon: "home", label: "Dashboard" }],
      },
      {
        items: [
          { icon: "product", label: "Products" },
          { icon: "repeat", label: "Movements" },
          { icon: "money", label: "Transaction" },
        ],
      },
      {
        items: [{ icon: "chart", label: "Statistics" }],
      },
    ],
    Operator: [
      {
        items: [{ icon: "home", label: "Dashboard" }],
      },
      {
        items: [{ icon: "add", label: "New Movement" }],
      },
      {
        items: [{ icon: "chart", label: "Statistics" }],
      },
    ],
  },
  logos: {
    top: "/logo2.png",
    bottom: "/logo-easy-tracability.png",
  },
};
