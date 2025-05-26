// EASY-TRACABILITY: backend/src/app.ts
import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import path from "path";
import redisClient from "./config/redis";
import { configureMiddlewares } from "./middlewares/mid.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";

// Routes
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import profileRoutes from "./routes/profile.route";
import productRoutes from "./routes/product.route";
import inventoryMovementRoutes from "./routes/inventoryMovement.route";
import transactionRoutes from "./routes/transaction.route";
import stateRoutes from "./routes/stats.routes";

const app = express();

// 1) Middlewares généraux
configureMiddlewares(app);

// 2) Servir les photos de profil **avant** l’authentification
app.use(
  "/api/profile",
  express.static(path.resolve(__dirname, "..", "public", "profile"))
);

// 3) Sessions (Redis)
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 },
  })
);

// 4) Routes API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventoryMovements", inventoryMovementRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/states", stateRoutes);

// 5) Gestion des erreurs
app.use(errorHandler);

// 6) Port
app.set("port", process.env.BG_PORT);

export default app;
