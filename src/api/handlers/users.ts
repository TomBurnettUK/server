import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../api/errors.js";
import { createUser } from "../../db/queries/users.js";

export async function postUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email }: { email: string } = req.body;
  try {
    if (!email) {
      throw new BadRequestError("No email found in body");
    }
    const user = await createUser({ email });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
