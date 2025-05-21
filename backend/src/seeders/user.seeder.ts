// EASY-TRACABILITY: backend/src/seeders/user.seeder.ts

import { UserModel } from "../models/user";
import { UserRole } from "../interfaces/user.interface";
import bcrypt from "bcrypt";

export async function seedUsers() {
  // Images seedées dans public/profile/
  const profileImages = [
    "profile-2.jpg",
    "profile-1.jpg",
    "profile-3.jpg",
    "profile-4.png",
    "profile-5.png",
    "profile-6.png",
    "profile-7.png",
    "profile-8.png",
    "profile-9.png",
    "profile-10.png",
  ];

  const rawUsers = [
    {
      uuid: "ce6d54a9-2799-4bb5-8a4e-04d6e13f4d9b",
      username: "Peter",
      role: UserRole.ADMIN,
      email: "lcrpeter7@gmail.com",
      img: profileImages[0],
    },
    {
      uuid: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      username: "Jade",
      role: UserRole.MANAGER,
      email: "lcr@gmail.com",
      img: profileImages[1],
    },
    {
      uuid: "f7e8d9c0-b1a2-3c4d-5e6f-7g8h9i0j1k2l",
      username: "Rodriguez",
      role: UserRole.OPERATOR,
      email: "peter@gmail.com",
      img: profileImages[2],
    },
    {
      uuid: "s1b2c3d4-e5f6-7g9k-9i0j-k1l2j3n4o5p6",
      username: "Alice",
      role: UserRole.OPERATOR,
      email: "alice@example.com",
      img: profileImages[3],
    },
    {
      uuid: "t1b2c3d4-e5f6-7g8h-1m0j-k1l2m3n4o5p6",
      username: "Bob",
      role: UserRole.MANAGER,
      email: "bob@example.com",
      img: profileImages[4],
    },
    {
      uuid: "r1b2c3d4-e7d6-7g8h-9i0j-k1l2m3n4o5p6",
      username: "Charlie",
      role: UserRole.OPERATOR,
      email: "charlie@example.com",
      img: profileImages[5],
    },
    {
      uuid: "gtb2c3d4-e5f6-7g8h-9i0j-k1l283n4o5p6",
      username: "David",
      role: UserRole.ADMIN,
      email: "david@example.com",
      img: profileImages[6],
    },
    {
      uuid: "f8d5e6d1-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      username: "Eva",
      role: UserRole.MANAGER,
      email: "eva@example.com",
      img: profileImages[7],
    },
    {
      uuid: "a8b2c3d4-d8c9-7g8h-9i0j-k1l2m3n4o5p6",
      username: "Frank",
      role: UserRole.OPERATOR,
      email: "frank@example.com",
      img: profileImages[8],
    },
    {
      uuid: "x862c3d4-e5f6-7g8h-9i0j-g8l2m3n4o5p6",
      username: "Grace",
      role: UserRole.OPERATOR,
      email: "grace@example.com",
      img: profileImages[9],
    },
  ];

  const users = rawUsers.map((u) => ({
    uuid: u.uuid,
    username: u.username,
    hashedPassword: bcrypt.hashSync(
      u.role === UserRole.ADMIN
        ? "admin123"
        : u.role === UserRole.MANAGER
        ? "manager123"
        : "operator123",
      10
    ),
    role: u.role,
    email: u.email,
    // On utilise directement les fichiers existants dans public/profile
    profilePicture: `/profile/${u.img}`,
  }));

  await UserModel.bulkCreate(users);
  console.log("✅ Users seeded avec images existantes");
}
