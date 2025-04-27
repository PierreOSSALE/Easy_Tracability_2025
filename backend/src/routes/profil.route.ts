//EASY-TRACABILITY: backend/src/routes/user.route.ts

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

// Toutes les routes sont désormais sécurisées : hybridAuth obligatoire
router.use(hybridAuth);

router.put(
  "/profile/:id",
  authorizeRole(["Administrateur", "Gestionnaire", "Operateur"]),
  isSelfOrAdmin,
  uploadProfilePicture,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const userService = new UserService();

    const { email } = req.body; // Récupérer l'email du form-data

    if (!email && !req.file) {
      return res
        .status(400)
        .json({ message: "Aucune donnée fournie pour mise à jour." });
    }

    const userBeforeUpdate = await userService.getUserById(id);

    const updateData: any = {};

    // Si l'email est fourni
    if (email) {
      updateData.email = email;
    }

    // Si un fichier est uploadé
    if (req.file) {
      const profilePictureUrl = `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${id}/${req.file.filename}`;
      updateData.profilePicture = profilePictureUrl;

      // Supprimer ancienne photo si existante
      if (userBeforeUpdate?.profilePicture) {
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

    const updatedUser = await userService.updateUser(id, updateData);

    res.status(200).json({
      message: "Profil mis à jour avec succès.",
      data: updatedUser,
    });
  })
);
