// EASY-TRACABILITY: backend/src/interfaces/user.interface.ts

export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  OPERATOR = "Operator",
}

export interface IUser {
  uuid: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
  profilePicture?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface IUserCreation {
  uuid?: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
  profilePicture?: string;
}

export interface IUserUpdate {
  username?: string;
  email?: string;
  hashedPassword?: string;
  role?: UserRole;
  profilePicture?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
