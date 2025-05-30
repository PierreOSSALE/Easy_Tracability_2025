// EASY-TRACABILITY:frontend/src/components/ui/Sidebar/types.ts

export interface NavigationItem {
  icon: string;
  label: string;
  /** Route path to navigate on click */
  path?: string;
}
