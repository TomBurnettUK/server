import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../../api/errors.js";
import { checkPasswordHash, hashPassword } from "../../auth.js";
import { createUser, fetchUserByEmail } from "../../db/queries/users.js";
import { DBUser, User } from "../../db/schema.js";

export async function postUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    if (!email) {
      throw new BadRequestError("No email found in body");
    }
    if (!password) {
      throw new BadRequestError("No password found in body");
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({ email, hashedPassword });

    if (!user) {
      throw new BadRequestError("User already exists");
    }

    res.status(201).json(sanitizeUser(user));
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const user = await fetchUserByEmail(email);

    if (await checkPasswordHash(password, user.hashedPassword)) {
      res.json(sanitizeUser(user));
    } else {
      throw new UnauthorizedError("Incorrect email or password");
    }
  } catch (err) {
    next(err);
  }
}

function sanitizeUser(user: DBUser): User {
  const { hashedPassword, ...safeUser } = user;
  return safeUser;
}
