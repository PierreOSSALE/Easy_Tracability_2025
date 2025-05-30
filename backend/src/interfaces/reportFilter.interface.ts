//EASY-TRACABILITY: backend//src/interfaces/reportFilter.interface.ts
export interface IReportFilterDTO {
  startDate: string; // ISO date
  endDate: string; // ISO date
  productBarcode?: string; // filtre optionnel
  userUUID?: string; // filtre optionnel
  minQuantity?: number; // seuil par exemple
}
