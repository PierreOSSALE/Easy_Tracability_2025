// EASY-TRACABILITY: backend/src/middlewares/uploadProfilePicture.middleware.ts

import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.uuid || (req.user as any)?.uuid; // ✅

    if (!userId) {
      return cb(
        new Error("Impossible de déterminer l'utilisateur pour l'upload"),
        ""
      );
    }

    const dir = `uploads/profile-pictures/${userId}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `profile-${Date.now()}${extension}`;
    cb(null, filename);
  },
});

function fileFilter(
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Seulement .jpeg, .jpg et .png sont autorisés !"));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

export const uploadProfilePicture = upload.single("profilePicture");
