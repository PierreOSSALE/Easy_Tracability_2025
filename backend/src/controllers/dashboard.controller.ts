// EASY-TRACABILITY: backend/src/controllers/dashboard.controller.ts
import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

const dashService = new DashboardService();

export class DashboardController {
  static async getInventoryTrend(req: Request, res: Response) {
    const { start, end } = req.query;
    const data = await dashService.getInventoryTrend(
      new Date(start as string),
      new Date(end as string)
    );
    res.status(200).json(data);
  }

  static async getSalesByProduct(req: Request, res: Response) {
    const data = await dashService.getSalesByProduct();
    res.status(200).json(data);
  }

  static async getAlerts(req: Request, res: Response) {
    const threshold = parseInt(req.query.threshold as string, 10) || 0;
    const data = await dashService.getAlerts(threshold);
    res.status(200).json(data);
  }
}
