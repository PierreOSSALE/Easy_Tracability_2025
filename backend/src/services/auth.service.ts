// EASY-TRACABILITY: backend/src/services/auth.service.ts

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/associations";
import { TokenService } from "./token.service";
import { UserSessionDTO } from "../dto/user-session.dto";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";

export class AuthService {
  private tokenService = new TokenService();

  async validateUser(
    username: string,
    password: string
  ): Promise<InstanceType<typeof UserModel> | null> {
    const user = await UserModel.findOne({ where: { username } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(
      password as string,
      (user as any).hashedPassword
    );
    return isMatch ? user : null;
  }

  async generateTokens(
    user: InstanceType<typeof UserModel>
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: UserSessionDTO = { uuid: user.uuid, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await this.tokenService.storeRefreshToken(payload, refreshToken);
    return { accessToken, refreshToken };
  }

  decodePayload(token: string): UserSessionDTO {
    const decoded = jwt.decode(token) as UserSessionDTO | null;
    if (!decoded?.uuid || !decoded?.role) {
      throw new Error("Payload JWT invalide");
    }
    return decoded;
  }

  async rotateRefresh(
    oldToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.tokenService.rotateRefreshToken(oldToken);
  }

  async logout(uuid: string): Promise<void> {
    await this.tokenService.revokeAll({ uuid, role: "user" });
  }
}
