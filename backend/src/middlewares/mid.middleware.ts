// EASY-TRACABILITY: backend/src/middlewares/mid.js
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { Application } from "express";
dotenv.config();

const configureMiddlewares = (app: Application): void => {
  app.use(morgan("dev")).use(cors());
};

export { configureMiddlewares };
