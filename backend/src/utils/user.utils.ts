// EASY-TRACABILITY: backend/src/utils/user.utils.ts

import { IUser } from "../interfaces/user.interface";

// Les champs exposés au front
export interface SafeUser {
  uuid: string;
  username: string;
  email: string;
  role: string;
  profilePicture?: string;
}

// Transforme un plain-object IUser en SafeUser
export function sanitizeUser(user: IUser): SafeUser {
  return {
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
  };
}
