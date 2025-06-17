// backend/src/seeders/dimTime.seeder.ts

import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";
import { Op } from "sequelize";
import { DimTimeModel } from "./../models/dimTime";

export async function seedDimTime(days: number = 365) {
  const start = new Date();
  const records: any[] = [];
  for (let i = 0; i < days; i++) {
    const dt = addDays(start, i);
    records.push({
      uuid: uuidv4(),
      date: dt,
      dayOfWeek: dt.getDay() === 0 ? 7 : dt.getDay(),
      month: dt.getMonth() + 1,
      year: dt.getFullYear(),
    });
  }
  await DimTimeModel.bulkCreate(records);
  console.log(`✅ ${records.length} DimTime insérés`);
}

/**
 * Trouve ou crée une entrée DimTime pour la date donnée
 */
export async function ensureDimTime(dt: Date): Promise<string> {
  const dayStart = new Date(dt);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dt);
  dayEnd.setHours(23, 59, 59, 999);

  // Cherche une dimension existante
  let dim = await DimTimeModel.findOne({
    where: { date: { [Op.between]: [dayStart, dayEnd] } },
  });

  if (!dim) {
    // Crée une nouvelle entrée simple
    dim = await DimTimeModel.create({ date: dt });
    console.log(
      `DimTime créé pour la date ${dt.toDateString()} (uuid: ${dim.uuid})`
    );
  }

  return dim.uuid;
}
