// backend/src/interfaces/dashboard.interface.ts

export interface IChartPoint {
  label: string; // ex. ‘2025-05-27’, ou nom de produit
  value: number;
}

export interface IDashboardData {
  inventoryTrend: IChartPoint[];
  salesByProduct: IChartPoint[];
  alerts: Array<{
    productBarcode: string;
    quantity: number;
    threshold: number;
  }>;
}
