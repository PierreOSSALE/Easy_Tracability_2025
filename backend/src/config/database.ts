// EASY-TRACABILITY: backend/src/config/database.ts
import { Sequelize } from "sequelize";
import config from "dotenv";

config.config();
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);
export default sequelize;
