// EASY-TRACABILITY: frontend/src/types/dimension.ts

export interface DimProduct {
  uuid: string;
  name: string;
  barcode: string;
}

export interface DimTime {
  uuid: string;
  date: string;
  dayOfWeek: number;
  month: number;
  year: number;
}

export interface DimUser {
  uuid: string;
  username: string;
  role: string;
  email: string;
}
