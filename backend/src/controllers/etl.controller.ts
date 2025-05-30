// EASY-TRACABILITY: backend/src/controllers/etl.controller.ts
import { Request, Response } from "express";
import { ETLService } from "../services/etl.service";
import { ETLLogModel } from "../models/etlLog";
import { ETLLogInstance } from "../models/etlLog";

const etlService = ETLService.getInstance();

export class ETLController {
  static async triggerETL(req: Request, res: Response) {
    try {
      await etlService.runJob();
      res.status(200).json({ message: "ETL exécuté avec succès" });
    } catch (error: any) {
      console.error("Erreur ETL :", error);
      res.status(500).json({ message: "Erreur ETL", error: error.message });
    }
  }

  static async getLogs(req: Request, res: Response) {
    try {
      const logs: ETLLogInstance[] = await ETLLogModel.findAll({
        order: [["runDate", "DESC"]],
      });
      res.status(200).json(logs);
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Erreur récupération logs", error: err.message });
    }
  }
}
