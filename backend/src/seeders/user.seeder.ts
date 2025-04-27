// backend/seeders/user.seeder.ts
import { UserModel } from "../models/user";
import { UserRole } from "../interfaces/user.interface";
import bcrypt from "bcrypt";

export async function seedUsers() {
  const users = [
    {
      username: "admin",
      hashedPassword: await bcrypt.hash("admin123", 10),
      role: UserRole.ADMINISTRATEUR,
      email: "lcrpeter7@gmail.com",
    },
    {
      username: "manager",
      hashedPassword: await bcrypt.hash("manager123", 10),
      role: UserRole.GESTIONNAIRE,
      email: "lcr@gmail.com",
    },
    {
      username: "operator",
      hashedPassword: await bcrypt.hash("operator123", 10),
      role: UserRole.OPERATEUR,
      email: "peter@gmail.com",
    },
  ];

  await UserModel.bulkCreate(users);
  console.log("✅ Users seeded");
}
