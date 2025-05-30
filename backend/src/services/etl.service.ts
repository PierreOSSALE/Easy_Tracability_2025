// EASY-TRACABILITY: backend/src/services/etl.service.ts
import cron from "node-cron";
import {
  MovementLineModel,
  ProductModel,
  FactInventoryModel,
} from "../models/associations";
import { ETLLogModel } from "../models/etlLog";
import { IMovementLine } from "../interfaces/MovementLineModel.interface";
import { IFactInventory } from "../interfaces/factInventory.interface";
import { Op } from "sequelize";
import { ensureDimTime } from "../seeders/dimTime.seeder";

export class ETLService {
  private static instance: ETLService;

  static getInstance(): ETLService {
    if (!ETLService.instance) ETLService.instance = new ETLService();
    return ETLService.instance;
  }

  schedule(): void {
    cron.schedule("0 * * * *", () => {
      this.runJob().catch(console.error);
    });
  }

  async runJob(): Promise<void> {
    const start = new Date();
    let rowsExtracted = 0;
    let rowsLoaded = 0;
    try {
      const lines = await this.extract();
      rowsExtracted = lines.length;
      const facts = await this.transform(lines);
      rowsLoaded = facts.length;
      await this.load(facts);
      await ETLLogModel.create({
        runDate: start,
        status: "SUCCESS",
        rowsExtracted,
        rowsLoaded,
      });
    } catch (error: any) {
      await ETLLogModel.create({
        runDate: start,
        status: "FAILURE",
        rowsExtracted,
        rowsLoaded,
        errorMessage: error.message,
      });
      throw error;
    }
  }

  private async extract(): Promise<IMovementLine[]> {
    const rawLines = await MovementLineModel.findAll({
      where: { processed: false },
    });
    return rawLines.map((l) => l.toJSON() as IMovementLine);
  }

  private async transform(lines: IMovementLine[]): Promise<IFactInventory[]> {
    const facts: IFactInventory[] = [];
    for (const line of lines) {
      const product = await ProductModel.findOne({
        where: { barcode: line.productBarcode },
      });
      if (!product) {
        console.warn(`Produit non trouvé pour barcode ${line.productBarcode}`);
        continue;
      }

      const rawLine = (await MovementLineModel.findByPk(line.uuid, {
        include: ["order"],
      })) as any;
      const order = rawLine?.order;
      if (!order || !order.date) {
        console.warn(`Order invalide pour movementLine ${line.uuid}`);
        continue;
      }

      // Utilise ensureDimTime pour créer ou récupérer la dimension temps
      const timeUUID = await ensureDimTime(new Date(order.date));

      facts.push({
        uuid: line.uuid,
        productUUID: product.uuid,
        timeUUID,
        userUUID: order.userUUID,
        movementLineUUID: line.uuid,
        quantity: line.quantity,
        totalPrice: product.price * line.quantity,
      });
    }
    return facts;
  }

  private async load(facts: IFactInventory[]): Promise<void> {
    if (!facts.length) return;
    await FactInventoryModel.bulkCreate(facts as any, {
      updateOnDuplicate: ["quantity", "totalPrice"],
    });
    const ids = facts.map((f) => f.movementLineUUID!) as string[];
    await MovementLineModel.update({ processed: true } as any, {
      where: { uuid: { [Op.in]: ids } },
    });
  }
}
