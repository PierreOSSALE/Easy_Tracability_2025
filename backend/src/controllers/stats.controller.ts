// EASY-TRACABILITY: backend/src/controllers/stats.controller.ts

import { Request, Response } from "express";
import { StatsService } from "../services/stats.service";

const statsService = new StatsService();

export class StatsController {
  static async getOverview(req: Request, res: Response) {
    try {
      const stats = await statsService.getOverview();
      res.status(200).json(stats);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Impossible de charger les statistiques" });
    }
  }
}
