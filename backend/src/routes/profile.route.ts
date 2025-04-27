//EASY-TRACABILITY: backend/src/routes/profile.route.ts

import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { hybridAuth } from "../middlewares/hybridAuth.middleware";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";
import { isSelfOrAdmin } from "../middlewares/isSelfOrAdmin.middleware";
import { uploadProfilePicture } from "../middlewares/uploadProfilePicture.middleware";
import { UserService } from "../services/user.service";
import path from "path";
import fs from "fs";

const router = Router();
const userService = new UserService();

router.use(hybridAuth);

// ✅ Correction ici : :uuid au lieu de :id
router.put(
  "/:uuid",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  isSelfOrAdmin,
  uploadProfilePicture,
  catchAsync(async (req, res) => {
    const { uuid } = req.params;
    const { email } = req.body;

    if (!email && !req.file) {
      return res
        .status(400)
        .json({ message: "Aucune donnée fournie pour mise à jour." });
    }

    const userBeforeUpdate = await userService.getUserById(uuid);
    if (!userBeforeUpdate) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const updateData: any = {};

    if (email) updateData.email = email;

    if (req.file) {
      if (req.file) {
        const profilePictureUrl = `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${uuid}/${req.file.filename}`;

        if (profilePictureUrl && profilePictureUrl.startsWith("http")) {
          // ✅ Double protection
          updateData.profilePicture = profilePictureUrl;
        }
      }

      if (userBeforeUpdate.profilePicture) {
        const oldImagePath = path.join(
          __dirname,
          "../../",
          userBeforeUpdate.profilePicture
            .replace(`${req.protocol}://${req.get("host")}`, "")
            .replace(/\//g, path.sep)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedUser = await userService.updateUser(uuid, updateData);

    res.status(200).json({
      message: "Profil mis à jour avec succès.",
      data: updatedUser,
    });
  })
);

// ✅ Pas besoin de changer ici, route spécifique "me"
router.put(
  "/me",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  uploadProfilePicture,
  catchAsync(async (req, res) => {
    const currentUser = req.user as { uuid: string };
    const { email } = req.body;
    const uuid = currentUser.uuid;

    if (!email && !req.file) {
      return res
        .status(400)
        .json({ message: "Aucune donnée fournie pour mise à jour." });
    }

    const userBeforeUpdate = await userService.getUserById(uuid);
    if (!userBeforeUpdate) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const updateData: any = {};

    if (email) updateData.email = email;

    if (req.file) {
      const profilePictureUrl = `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${uuid}/${req.file.filename}`;
      updateData.profilePicture = profilePictureUrl;

      if (userBeforeUpdate.profilePicture) {
        const oldImagePath = path.join(
          __dirname,
          "../../",
          userBeforeUpdate.profilePicture
            .replace(`${req.protocol}://${req.get("host")}`, "")
            .replace(/\//g, path.sep)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedUser = await userService.updateUser(uuid, updateData);

    res.status(200).json({
      message: "Profil mis à jour avec succès.",
      data: updatedUser,
    });
  })
);

export default router;
