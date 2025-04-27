// backend/seeders/product.seeder.ts
import { ProductModel } from "../models/product";

export async function seedProducts() {
  const products = [
    {
      name: "Pommes Golden",
      barcode: "1234567890123",
      description: "Pommes douces, parfaites pour les tartes",
      price: 2.5,
      stockQuantity: 150,
      imageUrl: "../../../frontend/src/assets/logo2.png",
    },
    {
      name: "Pain Complet Bio",
      barcode: "9876543210987",
      description: "Pain bio à base de farine complète",
      price: 3.1,
      stockQuantity: 80,
      imageUrl: "../../../frontend/src/assets/logo-easy-tracability.png",
    },
    {
      name: "Jus d'orange",
      barcode: "5432109876543",
      description: "Pur jus pressé sans sucre ajouté",
      price: 1.9,
      stockQuantity: 200,
      imageUrl: "../../../frontend/src/assets/logo2.png",
    },
  ];

  await ProductModel.bulkCreate(products);
  console.log("✅ Products seeded");
}
