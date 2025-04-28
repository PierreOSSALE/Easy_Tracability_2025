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

router.put(
  "/me",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  uploadProfilePicture,
  catchAsync(async (req, res) => {
    const currentUser = req.user as { uuid: string };
    const uuid = currentUser.uuid; // PAS req.params.uuid ici !!!
    const { email } = req.body;

    console.log("DEBUG - UUID utilisé pour /me:", uuid);

    const userBeforeUpdate = await userService.getUserById(uuid);

    if (!userBeforeUpdate) {
      console.error(`Utilisateur introuvable pour UUID: ${uuid}`);
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const updateData: Partial<{ email: string; profilePicture: string }> = {};

    if (email) {
      updateData.email = email;
    }

    if (req.file?.filename) {
      const profilePictureUrl = `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${uuid}/${req.file.filename}`;

      if (/^https?:\/\/.+/i.test(profilePictureUrl)) {
        updateData.profilePicture = profilePictureUrl;
      }

      // Suppression de l'ancienne photo
      if (userBeforeUpdate.profilePicture) {
        const oldImageRelativePath = userBeforeUpdate.profilePicture
          .replace(`${req.protocol}://${req.get("host")}`, "")
          .replace(/\//g, path.sep);
        const oldImagePath = path.join(
          __dirname,
          "../../",
          oldImageRelativePath
        );

        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log(`Ancienne image supprimée: ${oldImagePath}`);
          } catch (err) {
            console.error("Erreur lors de la suppression de l'image:", err);
          }
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

// ✅ Route mise à jour de n'importe quel utilisateur (admin ou self)
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

    if (req.file && req.file.filename) {
      const profilePictureUrl = `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${uuid}/${req.file.filename}`;

      // Double sécurité URL
      if (/^https?:\/\/.+/i.test(profilePictureUrl)) {
        updateData.profilePicture = profilePictureUrl;
      }

      // Suppression ancienne image uniquement si nouveau fichier ok
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
