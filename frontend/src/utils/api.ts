// EASY-TRACABILITY:frontend/src/types/api.ts

export interface BackendError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
