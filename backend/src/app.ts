// EASY-TRACABILITY: backend/src/app.ts

import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import redisClient from "./config/redis";
import { configureMiddlewares } from "./middlewares/mid.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import productRoutes from "./routes/product.route";
import profileRoutes from "./routes/profile.route";
import inventoryMovementRoutes from "./routes/inventoryMovement.route";
import transactionRoutes from "./routes/transaction.route";
import stateRoutes from "./routes/stats.routes";
import configurationRoutes from "./routes/configuration.route";

const app = express();

// Middlewares globaux
configureMiddlewares(app);

// Middleware pour parser le corps des requêtes
app.use(express.json());

// Session avec RedisStore v8
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventoryMovement", inventoryMovementRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/configurations", configurationRoutes);

// Gestion des erreurs
app.use(errorHandler);

app.set("port", process.env.BG_PORT);

export default app;
