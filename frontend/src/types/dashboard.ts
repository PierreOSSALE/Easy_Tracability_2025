// EASY-TRACABILITY: frontend/src/types/dashboard.ts

export interface IChartPoint {
  label: string; // date ou nom produit
  value: number;
}

export interface DashboardData {
  inventoryTrend: IChartPoint[];
  salesByProduct: IChartPoint[];
  alerts: Array<{
    productBarcode: string;
    quantity: number;
    threshold: number;
  }>;
}
