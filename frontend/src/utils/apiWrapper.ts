// EASY-TRACABILITY:frontend/src/services/error/apiWrapper.ts

import { handleApiError } from "./errorHandler";

export const apiWrapper = async <T>(apiFn: () => Promise<T>): Promise<T> => {
  try {
    return await apiFn();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
