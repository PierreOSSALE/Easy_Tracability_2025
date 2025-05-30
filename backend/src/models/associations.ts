// EASY-TRACABILITY: backend/src/models/associations.ts

import { UserModel } from "./user";
import { ProductModel } from "./product";
import { MovementOrderModel } from "./movementOrder";
import { MovementLineModel } from "./movementLine";
import { TransactionModel } from "./transaction";
import { DimProductModel } from "./dimProduct";
import { DimTimeModel } from "./dimTime";
import { DimUserModel } from "./dimUser";
import { FactInventoryModel } from "./factInventory";
import { ETLLogModel } from "./etlLog";

// Associations:

// Un User a plusieurs MovementOrders
UserModel.hasMany(MovementOrderModel, { foreignKey: "userUUID", as: "orders" });
MovementOrderModel.belongsTo(UserModel, { foreignKey: "userUUID", as: "user" });

// Un MovementOrder a plusieurs MovementLines
MovementOrderModel.hasMany(MovementLineModel, {
  foreignKey: "movementOrderUUID",
  as: "lines",
});
MovementLineModel.belongsTo(MovementOrderModel, {
  foreignKey: "movementOrderUUID",
  as: "order",
});

// Un MovementLine référence un Product
ProductModel.hasMany(MovementLineModel, {
  foreignKey: "productBarcode",
  sourceKey: "barcode",
  as: "movementLines",
});
MovementLineModel.belongsTo(ProductModel, {
  foreignKey: "productBarcode",
  targetKey: "barcode",
  as: "product",
});

// Un MovementOrder a une Transaction
MovementOrderModel.hasOne(TransactionModel, {
  foreignKey: "movementOrderUUID",
  as: "transaction",
});
TransactionModel.belongsTo(MovementOrderModel, {
  foreignKey: "movementOrderUUID",
  as: "order",
});
// FactInventory ↔ DimProduct / DimTime / DimUser / InventoryMovement
DimProductModel.hasMany(FactInventoryModel, {
  foreignKey: "productUUID",
  as: "facts",
});
FactInventoryModel.belongsTo(DimProductModel, {
  foreignKey: "productUUID",
  as: "productDim",
});

DimTimeModel.hasMany(FactInventoryModel, {
  foreignKey: "timeUUID",
  as: "facts",
});
FactInventoryModel.belongsTo(DimTimeModel, {
  foreignKey: "timeUUID",
  as: "timeDim",
});

DimUserModel.hasMany(FactInventoryModel, {
  foreignKey: "userUUID",
  as: "facts",
});
FactInventoryModel.belongsTo(DimUserModel, {
  foreignKey: "userUUID",
  as: "userDim",
});

MovementLineModel.hasMany(FactInventoryModel, {
  foreignKey: "movementLineUUID",
  as: "facts",
});
FactInventoryModel.belongsTo(MovementLineModel, {
  foreignKey: "movementLineUUID",
  as: "movementLine",
});
export {
  UserModel,
  ProductModel,
  MovementOrderModel,
  MovementLineModel,
  TransactionModel,
  DimProductModel,
  DimTimeModel,
  DimUserModel,
  FactInventoryModel,
  ETLLogModel,
};
