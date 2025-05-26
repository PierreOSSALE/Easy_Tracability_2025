// EASY-TRACABILITY: backend/src/models/associations.ts

import { UserModel } from "./user";
import { ProductModel } from "./product";
import { MovementOrderModel } from "./movementOrder";
import { MovementLineModel } from "./movementLine";
import { TransactionModel } from "./transaction";

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

export {
  UserModel,
  ProductModel,
  MovementOrderModel,
  MovementLineModel,
  TransactionModel,
};
