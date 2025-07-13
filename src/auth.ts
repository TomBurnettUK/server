import { compare, hash } from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "./api/errors.js";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function checkPasswordHash(
  password: string,
  hash: string
): Promise<boolean> {
  return compare(password, hash);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  const timeNowInSecs = Math.floor(Date.now() / 1000);
  const payload: Payload = {
    iss: "chirpy",
    sub: userID,
    iat: timeNowInSecs,
    exp: timeNowInSecs + expiresIn,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const payload = jwt.verify(tokenString, secret) as Payload;
    if (!payload.sub) {
      throw new Error();
    }
    return payload.sub;
  } catch {
    throw new UnauthorizedError("invalid JWT");
  }
}
