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
    {
      uuid: "s1b2c3d4-e5f6-7g9k-9i0j-k1l2j3n4o5p6",
      username: "Alice",
      hashedPassword: await bcrypt.hash("password123", 10),
      role: UserRole.OPERATOR,
      email: "alice@example.com",
      profilePicture: "/profil/profile-4.png",
    },
    {
      uuid: "t1b2c3d4-e5f6-7g8h-1m0j-k1l2m3n4o5p6",
      username: "Bob",
      hashedPassword: await bcrypt.hash("password123", 10),
      role: UserRole.MANAGER,
      email: "bob@example.com",
      profilePicture: "/profil/profile-5.png",
    },
    {
      uuid: "r1b2c3d4-e7d6-7g8h-9i0j-k1l2m3n4o5p6",
      username: "Charlie",
      hashedPassword: await bcrypt.hash("password123", 10),
      role: UserRole.OPERATOR,
      email: "charlie@example.com",
      profilePicture: "/profil/profile-6.png",
    },
    {
      uuid: "gtb2c3d4-e5f6-7g8h-9i0j-k1l283n4o5p6",
      username: "David",
      hashedPassword: await bcrypt.hash("password123", 10),
      role: UserRole.ADMIN,
      email: "david@example.com",
      profilePicture: "/profil/profile-7.png",
    },
    {
      uuid: "f8d5e6d1-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      username: "Eva",
      hashedPassword: await bcrypt.hash("password123", 10),
      role: UserRole.MANAGER,
      email: "eva@example.com",
      profilePicture: "/profil/profile-8.png",
    },
    {
      uuid: "a8b2c3d4-d8c9-7g8h-9i0j-k1l2m3n4o5p6",
      username: "Frank",
      hashedPassword: await bcrypt.hash("password123", 10),
      role: UserRole.OPERATOR,
      email: "frank@example.com",
      profilePicture: "/profil/profile-9.png",
    },
    {
      uuid: "x862c3d4-e5f6-7g8h-9i0j-g8l2m3n4o5p6",
      username: "Grace",
      hashedPassword: await bcrypt.hash("password123", 10),
      role: UserRole.OPERATOR,
      email: "grace@example.com",
      profilePicture: "/profil/profile-10.png",
    },
  ];

  await UserModel.bulkCreate(users);
  console.log("✅ Users seeded");
}
