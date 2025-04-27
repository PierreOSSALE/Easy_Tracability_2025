// EASY-TRACABILITY: backend/src/middlewares/isSelfOrAdmin.middleware.ts

import { Request, Response, NextFunction } from "express";
import { UserRole } from "../interfaces/user.interface";

export function isSelfOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const userId = req.params.id;
  const currentUser = req.user as { uuid: string; role: UserRole };

  if (!currentUser) {
    return next(new Error("Non authentifié"));
  }

  if (
    currentUser.role === UserRole.ADMINISTRATEUR ||
    currentUser.uuid === userId
  ) {
    return next(); // ✅ OK
  }

  return next(new Error("Accès refusé")); // ✅ On lève une erreur, pas de res.send ici
}
