// EASY-TRACABILITY: backend/src/services/dataWarehouse.service.ts
import {
  FactInventoryModel,
  DimTimeModel,
  DimProductModel,
  DimUserModel,
} from "../models/associations";
import { Op } from "sequelize";

export class DataWarehouseService {
  /**
   * Récupère les faits, éventuellement filtrés par période (startDate/endDate au format YYYY-MM-DD).
   */
  async queryFacts(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    const { startDate, endDate } = params;

    // Préparer le where sur DimTime si besoin
    let timeWhere: any = {};
    let requireTime = false;
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      timeWhere = { date: { [Op.between]: [start, end] } };
      requireTime = true;
    }

    return await FactInventoryModel.findAll({
      include: [
        {
          model: DimTimeModel,
          as: "timeDim",
          where: timeWhere,
          required: requireTime, // si pas de filtre, ne pas forcer
        },
        { model: DimProductModel, as: "productDim", required: false },
        { model: DimUserModel, as: "userDim", required: false },
      ],
    });
  }

  /**
   * Récupère un enregistrement d’une dimension par clé primaire.
   */
  async queryDimension(
    dim: "product" | "time" | "user",
    key: string
  ): Promise<any> {
    switch (dim) {
      case "product":
        return (await import("../models/dimProduct")).DimProductModel.findByPk(
          key
        );
      case "time":
        return (await import("../models/dimTime")).DimTimeModel.findByPk(key);
      case "user":
        return (await import("../models/dimUser")).DimUserModel.findByPk(key);
      default:
        throw new Error(`Dimension inconnue : ${dim}`);
    }
  }
}
