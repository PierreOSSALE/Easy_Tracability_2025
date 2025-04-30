// backend/seeders/seed.ts
import sequelize from "../config/database";
import { seedUsers } from "./user.seeder";
import { seedProducts } from "./product.seeder";
import { seedTransactions } from "./transaction.seeder";
import { seedInventoryMovements } from "./inventoryMovement.seeder";
import { UserModel } from "../models/user";
import { ProductModel } from "../models/product";
import { seedConfigurations } from "./configuration.seeder";

(async () => {
  try {
    await sequelize.sync({ force: true }); // wipe + recreate
    console.log("🔄 DB synced");

    await seedUsers();
    await seedProducts();
    await seedConfigurations();

    const user = await UserModel.findOne();
    const product = await ProductModel.findOne();

    if (!user || !product) {
      throw new Error("❌ Aucun utilisateur ou produit trouvé après seeding");
    }

    // Créer les mouvements d'inventaire
    const inventoryMovements = await seedInventoryMovements(
      user.uuid,
      product.uuid
    );

    if (inventoryMovements.length === 0) {
      throw new Error("❌ Aucune entrée de mouvement d'inventaire créée");
    }

    // Utiliser le premier mouvement pour créer une transaction
    const firstMovementUUID = inventoryMovements[0].uuid;
    await seedTransactions(firstMovementUUID);

    console.log("🌱 Tous les seeders ont été exécutés avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur durant le seeding:", err);
    process.exit(1);
  }
})();
