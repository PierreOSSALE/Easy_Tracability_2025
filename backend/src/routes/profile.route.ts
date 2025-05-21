// EASY-TRACABILITY: backend/src/routes/profile.route.ts

import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";
import { uploadProfilePicture } from "../middlewares/uploadProfilePicture.middleware";
import { UserService } from "../services/user.service";
import { sanitizeUser } from "../utils/user.utils";
import path from "path";
import fs from "fs";

const router = Router();
const userService = new UserService();

// Toutes les routes suivantes nécessitent un token/session
router.use(hybridAuth);

// PUT /api/profile/me
router.put(
  "/me",
  authorizeRole(["Admin", "Manager", "Operator"]),
  uploadProfilePicture,
  catchAsync(async (req, res) => {
    const uuid = req.user!.uuid;
    const before = await userService.getUserById(uuid);
    if (!before) return res.status(404).json({ message: "Non trouvé" });

    const updateData: Partial<{ email: string; profilePicture: string }> = {};
    if (req.body.email) updateData.email = req.body.email;

    if (req.file) {
      // Relatif à public/, ex "/profile-pictures/uuid/nom.jpg"
      const rel = req.file.path.split("public")[1].replace(/\\/g, "/");
      updateData.profilePicture = rel;

      // Supprimer ancien fichier
      if (before.profilePicture) {
        const old = path.resolve(
          __dirname,
          "../../public",
          before.profilePicture
        );
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
    }

    const updated = await userService.updateUser(uuid, updateData);
    res.json({ message: "Profil mis à jour", user: sanitizeUser(updated!) });
  })
);

export default router;
