// EASY-TRACABILITY: backend/src/middlewares/hybridAuth.middleware.ts

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";

export const hybridAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Auth via session
  if (req.session?.user) {
    req.user = req.session.user;
    next();
    return;
  }

  // 2. Auth via Bearer token
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = payload;
      next();
      return;
    } catch (err) {
      res.status(403).json({ message: "Token JWT invalide" });
      return;
    }
  }

  res.status(401).json({ message: "Non authentifié" });
};
