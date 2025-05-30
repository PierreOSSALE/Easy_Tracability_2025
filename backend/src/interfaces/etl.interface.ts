//EASY-TRACABILITY: backend//src/interface/etl.interface.ts
export interface IETLJobDTO {
  jobId?: string; // UUID ou nom du job
  runDate?: Date; // date de lancement souhaitée
  status?: "PENDING" | "RUNNING" | "SUCCESS" | "FAILURE";
  rowsExtracted?: number;
  rowsLoaded?: number;
  errorMessage?: string;
}
