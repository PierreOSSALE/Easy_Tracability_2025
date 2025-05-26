// EASY-TRACABILITY: backend/server.ts
import app from "./src/app";
import sequelize from "./src/config/database";
import { seedUsers } from "./src/seeders/user.seeder";
import { seedProducts } from "./src/seeders/product.seeder";
import { seedTransactions } from "./src/seeders/transaction.seeder";
import { seedInventoryMovements } from "./src/seeders/inventoryMovement.seeder";
import { UserModel, ProductModel } from "./src/models/associations";

const port = app.get("port");

app.listen(port, async () => {
  console.log(`Le serveur écoute sur le port: http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("✅ Connexion à la base de données réussie.");

    // Seed Users et Products
    await seedUsers();
    await seedProducts();

    const user = await UserModel.findOne();
    const product = await ProductModel.findOne();

    if (!user || !product) {
      throw new Error(
        "❌ Aucun utilisateur ou produit disponible pour le seeding."
      );
    }

    // 🔁 Créer l’ordre et ses lignes d’inventaire
    const { order, lines } = await seedInventoryMovements(
      user.uuid,
      product.barcode
    );

    if (lines.length > 0) {
      // Passez order.uuid ici (pas firstLine.uuid)
      await seedTransactions(order.uuid);
    }

    console.log("🌱 Toutes les tables ont été remplies !");
  } catch (error) {
    console.error("❌ Échec de la connexion à la base de données:", error);
  }
});
