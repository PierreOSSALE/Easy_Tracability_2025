// EASY-TRACABILITY:backend/src/services/auth.service.ts
import bcrypt from "bcrypt";
import { UserModel } from "../models/associations";
import { TokenService } from "./token.service";
import { UserSessionDTO } from "../dto/user-session.dto";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";

export class AuthService {
  private tokenService = new TokenService();

  async validateUser(username: string, password: string) {
    const user = await UserModel.findOne({ where: { username } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    return isMatch ? user : null;
  }

  async generateTokens(user: any) {
    const payload: UserSessionDTO = { uuid: user.uuid, role: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await this.tokenService.storeRefreshToken(payload, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(uuid: string) {
    await this.tokenService.revokeAll({ uuid, role: "user" }); // rôle pas important ici
  }

  async rotateRefresh(token: string) {
    return await this.tokenService.rotateRefreshToken(token);
  }
}
