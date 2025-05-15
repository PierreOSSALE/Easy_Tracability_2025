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

router.use(hybridAuth);

// PUT /api/profile/me
router.put(
  "/me",
  authorizeRole(["Admin", "Manager", "Operator"]),
  uploadProfilePicture,
  catchAsync(async (req, res) => {
    const uuid = req.user!.uuid;
    const { email } = req.body;
    const before = await userService.getUserById(uuid);
    if (!before) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const updateData: Partial<{ email: string; profilePicture: string }> = {};
    if (email) {
      updateData.email = email;
    }
    if (req.file?.filename) {
      const url = `${req.protocol}://${req.get(
        "host"
      )}/uploads/profile-pictures/${uuid}/${req.file.filename}`;
      updateData.profilePicture = url;
      if (before.profilePicture) {
        const rel = before.profilePicture
          .replace(`${req.protocol}://${req.get("host")}`, "")
          .replace(/\//g, path.sep);
        const full = path.join(__dirname, "../../", rel);
        if (fs.existsSync(full)) fs.unlinkSync(full);
      }
    }

    const updated = await userService.updateUser(uuid, updateData);
    if (!updated) {
      return res.status(404).json({ message: "Échec de la mise à jour" });
    }
    res.json({ message: "Profil mis à jour.", user: sanitizeUser(updated) });
  })
);

export default router;
