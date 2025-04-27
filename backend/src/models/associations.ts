// EASY-TRACABILITY: backend/src/models/associations.ts

import { UserModel } from "./user";
import { ProductModel } from "./product";
import { IInventoryMovementModel } from "./inventoryMovement";
import { TransactionModel } from "./transaction";
import { ConfigurationModel } from "./configuration";

// Association: Un User peut avoir plusieurs InventoryMovements.
UserModel.hasMany(IInventoryMovementModel, {
  foreignKey: "userUUID",
  as: "movements",
});
IInventoryMovementModel.belongsTo(UserModel, {
  foreignKey: "userUUID",
  as: "user",
});

// Association: Un Product peut être impliqué dans plusieurs InventoryMovements.
ProductModel.hasMany(IInventoryMovementModel, {
  foreignKey: "productUUID",
  as: "movements",
});
IInventoryMovementModel.belongsTo(ProductModel, {
  foreignKey: "productUUID",
  as: "product",
});

// Association: Une Transaction est liée à un InventoryMovement.
// Ici, nous utilisons le même UUID pour représenter l'extension logique du mouvement.
IInventoryMovementModel.hasOne(TransactionModel, {
  foreignKey: "uuid", // même clé identique à celle du mouvement
  as: "transaction",
});
TransactionModel.belongsTo(IInventoryMovementModel, {
  foreignKey: "uuid",
  as: "inventoryMovement",
});

// Association optionnelle: Une Configuration peut être modifiée par un User.
// Cela permet de tracer qui a effectué la dernière modification.
ConfigurationModel.belongsTo(UserModel, {
  foreignKey: "lastModifiedBy",
  as: "modifiedBy",
});
UserModel.hasMany(ConfigurationModel, {
  foreignKey: "lastModifiedBy",
  as: "configurations",
});

export {
  UserModel,
  ProductModel,
  IInventoryMovementModel,
  TransactionModel,
  ConfigurationModel,
};
