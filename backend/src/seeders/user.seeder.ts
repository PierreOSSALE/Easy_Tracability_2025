// EASY-TRACABILITY: backend/seeders/user.seeder.ts

import { UserModel } from "../models/user";
import { UserRole } from "../interfaces/user.interface";
import bcrypt from "bcrypt";

export async function seedUsers() {
  const users = [
    {
      uuid: "ce6d54a9-2799-4bb5-8a4e-04d6e13f4d9b",
      username: "admin",
      hashedPassword: await bcrypt.hash("admin123", 10),
      role: UserRole.ADMINISTRATEUR,
      email: "lcrpeter7@gmail.com",
    },
    {
      uuid: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      username: "manager",
      hashedPassword: await bcrypt.hash("manager123", 10),
      role: UserRole.GESTIONNAIRE,
      email: "lcr@gmail.com",
    },
    {
      uuid: "f7e8d9c0-b1a2-3c4d-5e6f-7g8h9i0j1k2l",
      username: "operator",
      hashedPassword: await bcrypt.hash("operator123", 10),
      role: UserRole.OPERATEUR,
      email: "peter@gmail.com",
    },
  ];

  await UserModel.bulkCreate(users);
  console.log("✅ Users seeded");
}
