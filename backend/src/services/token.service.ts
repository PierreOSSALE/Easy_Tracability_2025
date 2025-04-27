// EASY-TRACABILITY:backend/src/services/token.service.ts

import redis from "../config/redis";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";
import { UserSessionDTO } from "../dto/user-session.dto";

export class TokenService {
  private refreshKey(uuid: string) {
    return `refresh:${uuid}`;
  }

  private blacklistKey(token: string) {
    return `blacklist:${token}`;
  }

  async storeRefreshToken(
    user: UserSessionDTO,
    refreshToken: string
  ): Promise<void> {
    await redis.set(
      this.refreshKey(user.uuid),
      refreshToken,
      "EX",
      60 * 60 * 24 * 7
    ); // 7 days
  }

  async isRefreshTokenValid(uuid: string, token: string): Promise<boolean> {
    const stored = await redis.get(this.refreshKey(uuid));
    return stored === token;
  }

  async blacklistToken(token: string, expiresInSeconds: number): Promise<void> {
    await redis.set(this.blacklistKey(token), "1", "EX", expiresInSeconds);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await redis.get(this.blacklistKey(token));
    return result === "1";
  }

  async rotateRefreshToken(
    oldToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = jwt.verify(
      oldToken,
      process.env.JWT_SECRET!
    ) as UserSessionDTO;

    // Check if old token is blacklisted
    const isBlacklisted = await this.isBlacklisted(oldToken);
    if (isBlacklisted) throw new Error("Token déjà utilisé (blacklist)");

    const isValid = await this.isRefreshTokenValid(payload.uuid, oldToken);
    if (!isValid) throw new Error("Token invalide ou mismatch");

    // Blacklist l’ancien token
    const decoded = jwt.decode(oldToken) as any;
    const expInSeconds = decoded.exp
      ? decoded.exp - Math.floor(Date.now() / 1000)
      : 60 * 60 * 24;
    await this.blacklistToken(oldToken, expInSeconds);

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    await this.storeRefreshToken(payload, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async revokeAll(user: UserSessionDTO): Promise<void> {
    await redis.del(this.refreshKey(user.uuid));
  }
}
