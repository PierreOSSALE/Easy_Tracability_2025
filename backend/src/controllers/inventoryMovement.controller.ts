//EASY-TRACABILITY: backend/src/controllers/inventoryMovement.controller.ts

import { Parser } from "json2csv"; // pour export CSV
import { Op } from "sequelize";
import { Request, Response } from "express";
import { InventoryMovementService } from "../services/inventoryMovement.service";
const inventoryMovementService = new InventoryMovementService();

export class InventoryMovementController {
  static async createInventoryMovement(req: Request, res: Response) {
    const userUUID = (req.user as any).uuid;
    const { ticketId, date, lines } = req.body;

    const result = await inventoryMovementService.createMovement({
      ticketId,
      userUUID,
      date,
      lines, // tableau de { productBarcode, operationType, quantity, price }
    });

    return res.status(201).json(result);
  }

  static async getAllInventoryMovements(
    req: Request,
    res: Response
  ): Promise<void> {
    const {
      productUUID,
      userUUID,
      startDate,
      endDate,
      limit = 10,
      offset = 0,
    } = req.query;

    const filters: any = {};

    if (productUUID) filters.productUUID = productUUID;
    if (userUUID) filters.userUUID = userUUID;
    if (startDate && endDate) {
      filters.date = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    }

    const movements = await inventoryMovementService.getAllMovements(
      filters,
      Number(limit),
      Number(offset)
    );
    res.status(200).json(movements);
  }

  static async getInventoryMovementById(
    req: Request,
    res: Response
  ): Promise<void> {
    const movement = await inventoryMovementService.getMovementById(
      req.params.uuid
    );
    res.status(200).json(movement);
  }

  static async updateInventoryMovement(
    req: Request,
    res: Response
  ): Promise<void> {
    const movement = await inventoryMovementService.updateMovement(
      req.params.uuid,
      req.body
    );
    res.status(200).json(movement);
  }

  static async deleteInventoryMovement(
    req: Request,
    res: Response
  ): Promise<void> {
    const result = await inventoryMovementService.deleteMovement(
      req.params.uuid
    );
    res.status(200).json(result);
  }

  static async getRecentInventoryMovements(
    req: Request,
    res: Response
  ): Promise<void> {
    const limit = parseInt(req.query.limit as string) || 10;
    const movements = await inventoryMovementService.getRecentMovements(limit);
    res.status(200).json(movements);
  }

  static async getInventoryMovementsByOperation(
    req: Request,
    res: Response
  ): Promise<void> {
    const { type } = req.query;

    if (!type) {
      res.status(400).json({ message: "Operation type is required" });
      return; // ⬅️ Juste ce `return` tout seul pour couper la fonction proprement
    }

    const allowedTypes = ["ENTREE", "SORTIE"];

    if (!allowedTypes.includes(type.toString().toUpperCase())) {
      res.status(400).json({
        message:
          "Operation type invalide. Les valeurs autorisées sont 'ENTREE' ou 'SORTIE'.",
      });
      return; // ⬅️ pareil ici
    }

    const movements = await inventoryMovementService.getMovementsByOperation(
      type.toString().toUpperCase()
    );

    res.status(200).json({ data: movements });
  }

  static async exportInventoryMovementsCSV(
    req: Request,
    res: Response
  ): Promise<void> {
    const movementsData = await inventoryMovementService.getAllMovements(
      {},
      1000,
      0
    ); // exporte jusqu'à 1000 lignes
    const movements = movementsData.rows.map((movement) => movement.toJSON());

    const parser = new Parser();
    const csv = parser.parse(movements);

    res.header("Content-Type", "text/csv");
    res.attachment("inventory_movements.csv");
    res.send(csv);
  }
}
