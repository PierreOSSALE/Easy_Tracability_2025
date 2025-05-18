// EASY-TRACABILITY: backend/server.ts
import app from "./src/app";
import sequelize from "./src/config/database";
import { seedUsers } from "./src/seeders/user.seeder";
import { seedProducts } from "./src/seeders/product.seeder";
import { seedTransactions } from "./src/seeders/transaction.seeder";
import { seedInventoryMovements } from "./src/seeders/inventoryMovement.seeder";
import { UserModel, ProductModel } from "./src/models/associations";
import { seedConfigurations } from "./src/seeders/configuration.seeder";

const port = app.get("port");

app.listen(port, async () => {
  console.log(`Le serveur écoute sur le port: http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("✅ Connexion à la base de données réussie.");

    // Seed Users et Products
    await seedUsers();
    await seedProducts();
    await seedConfigurations();

    const user = await UserModel.findOne();
    const product = await ProductModel.findOne();

    if (!user || !product) {
      throw new Error(
        "❌ Aucun utilisateur ou produit disponible pour le seeding."
      );
    }

    // 🔁 Créer les mouvements d'inventaire
    const inventoryMovements = await seedInventoryMovements(
      user.uuid,
      product.barcode
    );

    if (inventoryMovements.length > 0) {
      const movement = inventoryMovements[0]; // Prend le premier pour la transaction
      await seedTransactions(movement.uuid);
    }

    console.log("🌱 Toutes les tables ont été remplies !");
  } catch (error) {
    console.error("❌ Échec de la connexion à la base de données:", error);
  }
});
