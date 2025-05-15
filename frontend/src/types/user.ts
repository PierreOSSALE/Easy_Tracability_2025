// EASY-TRACABILITY:frontend/src/types/User.ts

export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  OPERATOR = "Operator",
}

export interface User {
  uuid: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
  profilePicture?: string; // 🆕 ajouté
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
