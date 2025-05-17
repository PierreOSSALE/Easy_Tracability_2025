// EASY-TRACABILITY: backend/src/middlewares/mid.middleware.ts

import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
dotenv.config();

export const configureMiddlewares = (app: Application): void => {
  app.use(morgan("dev"));

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://backend:3001",
      ],
      credentials: true,
    })
  );

  // ✅ Ajout des limites pour éviter erreur 413 Payload Too Large
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));
};
