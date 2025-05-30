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
    try {
      const payload = jwt.verify(
        oldToken,
        process.env.JWT_SECRET!
      ) as UserSessionDTO & { exp?: number; iat?: number };

      const { exp, iat, ...cleanPayload } = payload;

      const isBlacklisted = await this.isBlacklisted(oldToken);
      if (isBlacklisted) throw new Error("Token déjà utilisé (blacklist)");

      const isValid = await this.isRefreshTokenValid(payload.uuid, oldToken);
      if (!isValid) throw new Error("Token invalide ou mismatch");

      const decoded = jwt.decode(oldToken) as any;
      const expInSeconds = decoded.exp
        ? decoded.exp - Math.floor(Date.now() / 1000)
        : 60 * 60 * 24;
      await this.blacklistToken(oldToken, expInSeconds);

      const newAccessToken = generateAccessToken(cleanPayload);
      const newRefreshToken = generateRefreshToken(cleanPayload);
      await this.storeRefreshToken(cleanPayload, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      // Gérer les erreurs spécifiques de JWT
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Le token de rafraîchissement a expiré.");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Token de rafraîchissement invalide.");
      } else {
        // Pour les autres erreurs, les relancer ou les gérer selon le besoin
        throw error;
      }
    }
  }

  async revokeAll(user: UserSessionDTO): Promise<void> {
    await redis.del(this.refreshKey(user.uuid));
  }
}
