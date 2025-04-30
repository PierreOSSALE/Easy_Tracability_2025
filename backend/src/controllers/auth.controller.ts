// EASY-TRACABILITY: backend/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { sendResetPasswordEmail } from "../services/email.service";
import { catchAsync } from "../utils/catchAsync.utils";

const authService = new AuthService();
const userService = new UserService();

// Login (fonction inchangée car aucune gestion d'erreur explicite n'était présente)
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password, mode } = req.body;
  const user = await authService.validateUser(username, password);
  if (!user) {
    res.status(401).json({ message: "Identifiants invalides" });
    return;
  }
  if (mode === "jwt") {
    const tokens = await authService.generateTokens(user);
    res.json(tokens);
    return;
  }
  req.session.user = { uuid: user.uuid, role: user.role };
  res.json({ message: "Connecté via session", user: req.session.user });
};

// Refresh token
export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const tokens = await authService.rotateRefresh(token);
  res.json(tokens);
});

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  const uuid = req.user?.uuid || req.session?.user?.uuid;
  if (uuid) await authService.logout(uuid);
  req.session.destroy(() => {});
  res.json({ message: "Déconnecté" });
};

// Demander un reset de mot de passe
export const requestResetPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) throw new Error("Utilisateur non trouvé");

    const token = await userService.requestPasswordReset(user.username);

    // 🔥 ici, on passe le username dynamiquement !
    await sendResetPasswordEmail(email, token, user.username);
    res.json({ message: "Lien de réinitialisation envoyé par email" });
  }
);

// Effectuer un reset de mot de passe
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await userService.resetPassword(token, newPassword);
  res.json({ message: "Mot de passe mis à jour avec succès" });
});
