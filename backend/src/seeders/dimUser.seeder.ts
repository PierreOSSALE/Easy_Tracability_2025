// backend/seeders/dimUser.seeder.ts

import { UserModel } from "../models/user";
import { DimUserModel } from "../models/dimUser";

export async function seedDimUser() {
  const users = await UserModel.findAll();
  const dims = users.map((u) => ({
    uuid: u.uuid,
    username: u.username,
    role: u.role,
    email: u.email,
  }));
  await DimUserModel.bulkCreate(dims);
  console.log(`✅ ${dims.length} DimUser insérés`);
}
