// EASY-TRACABILITY: backend/src/middlewares/mid.middleware.ts
import path from "path";
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
        "http://localhost:3001",
      ],
      credentials: true,
    })
  );

  // ✅ Éviter 413 Payload Too Large
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  // Dossier des images de seed
  app.use(
    "/api/seeder-img",
    express.static(path.resolve(__dirname, "..", "..", "public", "seeder-img"))
  );
};
