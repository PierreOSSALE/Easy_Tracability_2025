// backend/src/interfaces/dimUser.interface.ts

import { UserRole } from "./user.interface";

export interface IDimUser {
  uuid: string;
  username: string;
  role: UserRole;
  email: string;
}
