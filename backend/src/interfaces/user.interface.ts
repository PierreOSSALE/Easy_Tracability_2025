// EASY-TRACABILITY: backend/src/interface/user.interface.ts

export enum UserRole {
  ADMINISTRATEUR = "Administrateur",
  GESTIONNAIRE = "Gestionnaire",
  OPERATEUR = "Operateur",
}

export interface IUser {
  uuid: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
  profilePicture?: string; // 🆕 ajouté
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface IUserCreation {
  uuid?: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
  profilePicture?: string; // 🆕 ajouté
}

export interface IUserUpdate {
  username?: string;
  email?: string;
  hashedPassword?: string;
  role?: UserRole;
  profilePicture?: string; // 🆕 ajouté
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
