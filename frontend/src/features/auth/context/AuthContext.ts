// src/features/auth/context/AuthContext.ts
import { createContext } from "react";
import { UseAuthResult } from "../hooks/useAuth";

export const AuthContext = createContext<UseAuthResult | null>(null);
