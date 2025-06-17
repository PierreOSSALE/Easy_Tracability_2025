// backend/seeders/factInventory.seeder.ts

import { Op } from "sequelize";
import { MovementLineModel } from "./../models/movementLine";
import { MovementOrderModel } from "./../models/movementOrder";
import { TransactionModel } from "./../models/transaction";
import { ProductModel } from "./../models/product";
import { FactInventoryModel } from "./../models/factInventory";
import { DimTimeModel } from "./../models/dimTime";

/**
 * Seed la table FactInventory en transformant les MovementLine non traitées
 */
export async function seedFactInventory() {
  try {
    // Charger toutes les lignes et leurs orders
    const lines = await MovementLineModel.findAll({
      include: [
        {
          model: MovementOrderModel,
          as: "order",
          include: [{ model: TransactionModel, as: "transaction" }],
        },
      ],
    });

    const factsToInsert = [] as Array<{
      uuid: string;
      productUUID: string;
      timeUUID: string;
      userUUID: string;
      movementLineUUID: string;
      quantity: number;
      totalPrice: number;
    }>;

    for (const line of lines) {
      const product = await ProductModel.findOne({
        where: { barcode: line.productBarcode },
      });
      if (!product) {
        console.warn(`Produit non trouvé pour barcode ${line.productBarcode}`);
        continue;
      }

      // Récupérer l'objet order via get si nécessaire
      const order: any =
        (line as any).order ||
        (typeof line.get === "function" ? line.get("order") : undefined);
      if (!order) {
        console.warn(`Order manquant pour movementLine ${line.uuid}`);
        continue;
      }

      // Convertir la date pour trouver ou créer la dimension temps
      const date = new Date(order.date);
      const timeUUID = await ensureDimTime(date);

      const totalPrice = product.price * line.quantity;

      factsToInsert.push({
        uuid: line.uuid,
        productUUID: product.uuid,
        timeUUID,
        userUUID: order.userUUID,
        movementLineUUID: line.uuid,
        quantity: line.quantity,
        totalPrice,
      });
    }

    // Insert ou met à jour en cas de duplicate key
    await FactInventoryModel.bulkCreate(factsToInsert, {
      updateOnDuplicate: ["quantity", "totalPrice"],
    });

    console.log(`✅ ${factsToInsert.length} facts insérés/mis à jour.`);
  } catch (err) {
    console.error("Erreur lors du seed FactInventory: ", err);
    throw err;
  }
}

/**
 * Trouve ou crée une entrée DimTime pour la date donnée
 */
async function ensureDimTime(dt: Date): Promise<string> {
  const dayStart = new Date(dt);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dt);
  dayEnd.setHours(23, 59, 59, 999);

  // Chercher une dimension existante
  let dim = await DimTimeModel.findOne({
    where: { date: { [Op.between]: [dayStart, dayEnd] } },
  });

  if (!dim) {
    // Créer une nouvelle entrée simple
    dim = await DimTimeModel.create({ date: dt });
    console.log(
      `DimTime créé pour la date ${dt.toDateString()} (uuid: ${dim.uuid})`
    );
  }

  return dim.uuid;
}
