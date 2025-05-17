// EASY-TRACABILITY:frontend/src/services/error/errorHandler.ts

import axios, { AxiosError } from "axios";
import { BackendError, ApiError } from "./api";

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<BackendError>;
    const responseData = err.response?.data;
    const statusCode = err.response?.status || 500;

    // Cas validation Sequelize : { errors: { message: string; error: string[] } }
    const wrapper = (responseData as any)?.errors;
    if (wrapper?.message && Array.isArray(wrapper.error)) {
      const detailMsg = wrapper.error.join(" • ");
      throw new ApiError(`${wrapper.message} : ${detailMsg}`, statusCode);
    }

    // Cas générique
    const msg = responseData?.message || "Erreur réseau";
    throw new ApiError(msg, statusCode);
  }

  if (error instanceof Error) {
    throw new ApiError(error.message, 500);
  }

  throw new ApiError("Une erreur inconnue s'est produite", 500);
};
