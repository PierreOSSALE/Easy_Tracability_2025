// EASY-TRACABILITY: backend/src/middlewares/uploadProfilePicture.middleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const uuid = (req.user as any)?.uuid;
    if (!uuid) return cb(new Error("Utilisateur non authentifié"), "");
    const dir = path.resolve(__dirname, "../../public/profile", uuid);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `profile-${Date.now()}${ext}`);
  },
});

export const uploadProfilePicture = multer({ storage }).single(
  "profilePicture"
);
