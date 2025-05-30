// backend/src/interfaces/dimTime.interface.ts

export interface IDimTime {
  uuid: string;
  date: Date;
  dayOfWeek: number; // 1 = Lundi … 7 = Dimanche
  month: number; // 1–12
  year: number;
}
