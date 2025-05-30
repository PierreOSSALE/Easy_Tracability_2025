// EASY-TRACABILITY: backend/src/controllers/dataWarehouse.controller.ts
import { Request, Response } from "express";
import { DataWarehouseService } from "../services/dataWarehouse.service";

const dwService = new DataWarehouseService();

export class DataWarehouseController {
  /** GET /api/dw/facts?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD */
  static async queryFacts(req: Request, res: Response) {
    const { startDate, endDate } = req.query as {
      startDate?: string;
      endDate?: string;
    };

    try {
      const facts = await dwService.queryFacts({ startDate, endDate });
      res.status(200).json(facts);
    } catch (err) {
      res.status(500).json({
        message: "Erreur lors de la requête des faits",
        error: (err as Error).message,
      });
    }
  }

  /** GET /api/dw/dimension/:dim/:key */
  static async queryDimension(req: Request, res: Response) {
    const { dim, key } = req.params;
    try {
      const result = await dwService.queryDimension(dim as any, key);
      if (!result) {
        return res.status(404).json({ message: "Élément non trouvé" });
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({
        message: `Erreur lors de la requête de la dimension ${dim}`,
        error: (err as Error).message,
      });
    }
  }
}
