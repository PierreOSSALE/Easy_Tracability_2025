// EASY-TRACABILITY: backend/src/utils/jwt.utils.ts

import jwt, { Secret, SignOptions } from "jsonwebtoken";
import ms from "ms";

const JWT_SECRET: Secret = (() => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return process.env.JWT_SECRET;
})();

const accessExpiresEnv = process.env.ACCESS_TOKEN_EXPIRES_IN;
const refreshExpiresEnv = process.env.REFRESH_TOKEN_EXPIRES_IN;

const accessTokenExpiresInSeconds = Math.floor(
  ms(accessExpiresEnv as ms.StringValue) / 1000
);

const accessTokenOptions: SignOptions = {
  expiresIn: accessTokenExpiresInSeconds,
};

const refreshTokenOptions: SignOptions = {
  expiresIn: refreshExpiresEnv as ms.StringValue,
};

export const generateAccessToken = (payload: string | object): string => {
  return jwt.sign(payload, JWT_SECRET, accessTokenOptions);
};

export const generateRefreshToken = (payload: string | object): string => {
  return jwt.sign(payload, JWT_SECRET, refreshTokenOptions);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
