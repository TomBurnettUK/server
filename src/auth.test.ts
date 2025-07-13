import { beforeAll, describe, expect, it } from "vitest";
import {
  checkPasswordHash,
  hashPassword,
  makeJWT,
  validateJWT,
} from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const result = await checkPasswordHash("incorrectpassword123", hash1);
    expect(result).toBe(false);
  });

  it("should generate different hashes for different passwords", async () => {
    expect(hash1).not.toBe(hash2);
  });

  it("should generate different hashes for same password (due to salt)", async () => {
    const hashAgain = await hashPassword(password1);
    expect(hash1).not.toBe(hashAgain);
  });
});

describe("JWT Creation", () => {
  const userID = "user123";
  const expiresIn = 60 * 60; // 1 hour
  const secret = "supersecretkey";

  it("should create a valid JWT with correct payload", async () => {
    const token = makeJWT(userID, expiresIn, secret);
    const payload = validateJWT(token, secret);
    expect(payload).toBe(userID);
  });

  it("should reject expired tokens", async () => {
    const expiredToken = makeJWT(userID, -1, secret);
    expect(() => validateJWT(expiredToken, secret)).toThrowError();
  });

  it("should reject tokens signed with the wrong secret", async () => {
    const token = makeJWT(userID, expiresIn, secret);
    const wrongSecret = "not_the_right_secret";
    expect(() => validateJWT(token, wrongSecret)).toThrowError();
  });
});
