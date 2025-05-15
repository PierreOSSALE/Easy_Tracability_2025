// EASY-TRACABILITY:frontend/src/features/auth/types/auth.ts

export interface LoginPayload {
  username: string;
  password: string;
  mode?: "session" | "jwt";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    uuid: string;
    username: string;
    email: string;
    role: string;
    profilePicture?: string;
  };
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
