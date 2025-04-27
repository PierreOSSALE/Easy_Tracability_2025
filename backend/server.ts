// EASY-TRACABILITY: backend/server.ts
import app from "./src/app";
import sequelize from "./src/config/database";
import { seedUsers } from "./src/seeders/user.seeder";
import { seedProducts } from "./src/seeders/product.seeder";
import { seedTransactions } from "./src/seeders/transaction.seeder";
import { seedInventoryMovements } from "./src/seeders/inventoryMovement.seeder";
import { UserModel } from "./src/models/associations";
import { ProductModel } from "./src/models/product";

const port = app.get("port");

app.listen(port, async () => {
  console.log(`Le serveur écoute sur le port: http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    // Utilise force: true ou alter: true selon ton besoin. Ici force: true recrée les tables.
    await sequelize.sync({ force: true });
    console.log("Connexion à la base de données réussie.");

    // Appel de tous les seeders
    await seedUsers();
    await seedProducts();

    // Récupère un utilisateur et un produit pour alimenter les autres seeders
    const user = await UserModel.findOne();
    const product = await ProductModel.findOne();

    if (user && product) {
      await seedInventoryMovements(user.uuid, product.uuid);
      // Optionnel : répéter pour simuler différents mouvements ou transactions
      await seedInventoryMovements(user.uuid, product.uuid);
      await seedTransactions();
    }

    console.log("🌱 Toutes les tables ont été remplies !");
  } catch (error) {
    console.error("Échec de la connexion à la base de données:", error);
  }
});
