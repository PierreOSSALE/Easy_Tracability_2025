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

    // 1️⃣ Seed users & products
    await seedUsers();
    await seedProducts();

    // 2️⃣ Récupère un user et un product existants
    const user = await UserModel.findOne();
    const product = await ProductModel.findOne();

    if (!user || !product) {
      throw new Error("❌ Aucun utilisateur ou produit trouvé après seeding");
    }

    // 3️⃣ Seed inventory movements (order + lines)
    //    → on passe product.barcode ici
    const { order, lines } = await seedInventoryMovements(
      user.uuid,
      product.barcode
    );

    if (lines.length === 0) {
      throw new Error("❌ Aucune ligne de mouvement d'inventaire créée");
    }

    // 4️⃣ Seed transactions pour cet order
    //    → on passe order.uuid (pas la ligne)
    await seedTransactions(order.uuid);

    console.log("🌱 Tous les seeders ont été exécutés avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur durant le seeding:", err);
    process.exit(1);
  }
})();
