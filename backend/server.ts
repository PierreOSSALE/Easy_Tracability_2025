// EASY-TRACABILITY: backend/server.ts
import app from "./src/app";
import sequelize from "./src/config/database";
import { seedUsers } from "./src/seeders/user.seeder";
import { seedProducts } from "./src/seeders/product.seeder";
import { seedTransactions } from "./src/seeders/transaction.seeder";
import { seedInventoryMovements } from "./src/seeders/inventoryMovement.seeder";
import { seedDimProduct } from "./src/seeders/dimProduct.seeder";
import { seedDimTime } from "./src/seeders/dimTime.seeder";
import { seedDimUser } from "./src/seeders/dimUser.seeder";
import { seedFactInventory } from "./src/seeders/factInventory.seeder";
import { UserModel, ProductModel } from "./src/models/associations";

const port = app.get("port");

app.listen(port, async () => {
  console.log(`Le serveur écoute sur le port: http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("✅ Connexion à la base de données réussie.");

    // 📦 1️⃣ Seed des données OLTP : Users, Products, Orders & Lines, Transactions
    await seedUsers();
    await seedProducts();

    const user = await UserModel.findOne();
    const product = await ProductModel.findOne();

    if (!user || !product) {
      throw new Error(
        "❌ Aucun utilisateur ou produit disponible pour le seeding."
      );
    }

    const { order, lines } = await seedInventoryMovements(
      user.uuid,
      product.barcode
    );

    if (lines.length > 0) {
      await seedTransactions(order.uuid);
    }

    // 🏗️ 2️⃣ Seed du Data Warehouse : dimensions et faits
    await seedDimProduct();
    await seedDimTime();
    await seedDimUser();
    await seedFactInventory();

    console.log("🌱 Toutes les tables ont été remplies !");
  } catch (error) {
    console.error(
      "❌ Échec de la connexion à la base de données ou du seeding :",
      error
    );
  }
});
