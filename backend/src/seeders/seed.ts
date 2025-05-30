// backend/seeders/seed.ts

import sequelize from "../config/database";
import { seedUsers } from "./user.seeder";
import { seedProducts } from "./product.seeder";
import { seedTransactions } from "./transaction.seeder";
import { seedInventoryMovements } from "./inventoryMovement.seeder";

import { seedDimProduct } from "./dimProduct.seeder";
import { seedDimTime } from "./dimTime.seeder";
import { seedDimUser } from "./dimUser.seeder";
import { seedFactInventory } from "./factInventory.seeder";

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("🔄 DB synced");

    // OLTP
    await seedUsers();
    await seedProducts();
    const user = await (await import("../models/user")).UserModel.findOne();
    const product = await (
      await import("../models/product")
    ).ProductModel.findOne();
    const { order } = await seedInventoryMovements(
      user!.uuid,
      product!.barcode
    );
    await seedTransactions(order.uuid);

    // DW
    await seedDimProduct();
    await seedDimTime();
    await seedDimUser();
    await seedFactInventory();

    console.log("🌱 Tous les seeders ont été exécutés !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur durant le seeding:", err);
    process.exit(1);
  }
})();
