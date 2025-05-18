// EASY-TRACABILITY: backend/src/utils/catchAsync.utils.ts

import { ProductModel } from "../models/associations";

function generateBarcode(): string {
  // Génère un code à 12 chiffres (ex. pour Code 128)
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

export async function generateUniqueBarcode(): Promise<string> {
  let barcode: string;
  let exists: boolean;

  do {
    barcode = generateBarcode();
    const found = await ProductModel.findOne({ where: { barcode } });
    exists = !!found;
  } while (exists);

  return barcode;
}
