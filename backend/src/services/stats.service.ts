//EASY-TRACABILITY: backend/src/services/stats.service.ts

import { IInventoryMovementModel } from "../models/associations";
import { Op } from "sequelize";

export class StatsService {
  async getOverview() {
    const [totalEntree, totalSortie] = await Promise.all([
      IInventoryMovementModel.sum("quantity", {
        where: { operationType: "ENTREE" },
      }),
      IInventoryMovementModel.sum("quantity", {
        where: { operationType: "SORTIE" },
      }),
    ]);

    return {
      totalEntree,
      totalSortie,
      stockNet: totalEntree - totalSortie,
    };
  }
}
