// backend/seeders/seed.ts
import sequelize from "../config/database";
import { seedUsers } from "./user.seeder";
import { seedProducts } from "./product.seeder";
import { seedTransactions } from "./transaction.seeder";
import { seedInventoryMovements } from "./inventoryMovement.seeder";
import { UserModel } from "../models/user";
import { ProductModel } from "../models/product";

(async () => {
  try {
    await sequelize.sync({ force: true }); // wipe + recreate
    console.log("🔄 DB synced");

    await seedUsers();
    await seedProducts();

    // On prend 1 user et 1 produit au hasard pour les mouvements
    const user = await UserModel.findOne();
    const product = await ProductModel.findOne();

    if (user && product) {
      await seedInventoryMovements(user.uuid, product.uuid);
    }
    if (user && product) {
      await seedInventoryMovements(user.uuid, product.uuid);
      await seedTransactions(); // ⬅️ ICI
    }

    console.log("🌱 All seeders ran successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  }
})();
