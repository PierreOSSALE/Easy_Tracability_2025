//EASY-TRACABILITY: backend/src/controllers/stats.controller.ts
import { Request, Response } from "express";
import { StatsService } from "../services/stats.service";

const statsService = new StatsService();

export class StatsController {
  static async getOverview(req: Request, res: Response) {
    const stats = await statsService.getOverview();
    res.status(200).json(stats);
  }
}
