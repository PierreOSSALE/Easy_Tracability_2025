// EASY-TRACABILITY:frontend/src/services/error/errorHandler.ts

import axios, { AxiosError } from "axios";
import { BackendError, ApiError } from "./api";

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<BackendError>;
    const message = err.response?.data?.message || "Erreur réseau";
    const statusCode = err.response?.status || 500;
    throw new ApiError(message, statusCode);
  }

  if (error instanceof Error) {
    throw new ApiError(error.message, 500);
  }

  throw new ApiError("Une erreur inconnue s'est produite", 500);
};
