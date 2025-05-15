// EASY-TRACABILITY: backend/seeders/user.seeder.ts

import { UserModel } from "../models/user";
import { UserRole } from "../interfaces/user.interface";
import bcrypt from "bcrypt";

export async function seedUsers() {
  const users = [
    {
      uuid: "ce6d54a9-2799-4bb5-8a4e-04d6e13f4d9b",
      username: "Peter",
      hashedPassword: await bcrypt.hash("admin123", 10),
      role: UserRole.ADMIN,
      email: "lcrpeter7@gmail.com",
      // URL relative vers le dossier public/img/profil/
      profilePicture: "/profil/profile-1.png",
    },
    {
      uuid: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      username: "Jade",
      hashedPassword: await bcrypt.hash("manager123", 10),
      role: UserRole.MANAGER,
      email: "lcr@gmail.com",
      profilePicture: "/profil/profile-2.png",
    },
    {
      uuid: "f7e8d9c0-b1a2-3c4d-5e6f-7g8h9i0j1k2l",
      username: "Rodriguez",
      hashedPassword: await bcrypt.hash("operator123", 10),
      role: UserRole.OPERATOR,
      email: "peter@gmail.com",
      profilePicture: "/profil/profile-3.png",
    },
  ];

  await UserModel.bulkCreate(users);
  console.log("✅ Users seeded");
}
