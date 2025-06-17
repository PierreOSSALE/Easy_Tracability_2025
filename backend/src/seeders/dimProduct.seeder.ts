import { ProductModel } from "./../models/product";
// backend/seeders/dimProduct.seeder.ts

import { DimProductModel } from "./../models/dimProduct";

export async function seedDimProduct() {
  const products = await ProductModel.findAll();
  const dims = products.map((p) => ({
    uuid: p.uuid,
    name: p.name,
    barcode: p.barcode,
  }));
  await DimProductModel.bulkCreate(dims);
  console.log(`✅ ${dims.length} DimProduct insérés`);
}
