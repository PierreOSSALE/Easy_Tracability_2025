// EASY-TRACABILITY: backend/src/middlewares/errorHandler.middleware.ts

import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  UniqueConstraintError,
  ValidationErrorItem,
} from "sequelize";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err.stack);

  // Gestion des erreurs de validation Sequelize (y compris les validateurs d'attributs)
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    const messages: string[] = err.errors.map(
      (errorItem: ValidationErrorItem) => errorItem.message
    );
    res.status(400).json({
      errors: { message: "Erreur de validation", error: messages },
    });
    return;
  }

  // Utilisation d'un statut personnalisé si disponible, sinon 500 par défaut
  const statusCode: number = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      stack: err.stack,
      customMessage: err.customMessage,
      customProperty: err.customProperty,
    },
  });
}

export { errorHandler };
