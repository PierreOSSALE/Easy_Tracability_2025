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
  foreignKey: "productBarcode",
  sourceKey: "barcode",
  as: "movements",
});
IInventoryMovementModel.belongsTo(ProductModel, {
  foreignKey: "productBarcode",
  targetKey: "barcode",
  as: "product",
});

// Association: Une Transaction est liée à un InventoryMovement.
IInventoryMovementModel.hasOne(TransactionModel, {
  foreignKey: "inventoryMovementUUID",
  as: "transaction",
});
TransactionModel.belongsTo(IInventoryMovementModel, {
  foreignKey: "inventoryMovementUUID",
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
