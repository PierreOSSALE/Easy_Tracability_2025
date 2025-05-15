// EASY-TRACABILITY: backend/src/controllers/auth.controller.ts

import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { sendResetPasswordEmail } from "../services/email.service";
import { catchAsync } from "../utils/catchAsync.utils";
import { sanitizeUser, SafeUser } from "../utils/user.utils";
import { IUser } from "../interfaces/user.interface";

const authService = new AuthService();
const userService = new UserService();

// POST /api/auth/login
export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password, mode } = req.body;
  const model = await authService.validateUser(username, password);
  if (!model) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const userData = model.toJSON() as IUser;
  const safeUser: SafeUser = sanitizeUser(userData);

  if (mode === "jwt") {
    const { accessToken, refreshToken } = await authService.generateTokens(
      model
    );
    return res.json({ accessToken, refreshToken, user: safeUser });
  }

  req.session.user = safeUser;
  res.json({ message: "Connecté via session", user: safeUser });
});

// POST /api/auth/refresh
export const refresh = catchAsync(async (req: Request, res: Response) => {
  const oldToken = req.cookies?.refreshToken;
  if (!oldToken) {
    return res
      .status(204)
      .json({ message: "Token de rafraîchissement manquant" });
  }

  const { accessToken, refreshToken } = await authService.rotateRefresh(
    oldToken
  );
  const payload = authService.decodePayload(refreshToken);
  const model = await userService.getUserById(payload.uuid);
  if (!model) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  const safeUser = sanitizeUser(model);
  res.json({ accessToken, refreshToken, user: safeUser });
});

// POST /api/auth/logout
export const logout = catchAsync(async (req: Request, res: Response) => {
  const uuid = req.user?.uuid || req.session?.user?.uuid;
  if (uuid) await authService.logout(uuid);
  req.session.destroy(() => {});
  res.json({ message: "Déconnecté" });
});

// POST /api/auth/request-reset-password
export const requestResetPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const token = await userService.requestPasswordReset(user.username);
    await sendResetPasswordEmail(email, token, user.username);
    res.json({ resetToken: token });
  }
);

// POST /api/auth/reset-password
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await userService.resetPassword(token, newPassword);
  res.json({ message: "Mot de passe mis à jour avec succès" });
});

// GET /api/auth/me
export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Non connecté" });
  }
  const model = await userService.getUserById(req.user.uuid);
  if (!model) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }
  const safeUser = sanitizeUser(model);
  res.json({ user: safeUser });
});
