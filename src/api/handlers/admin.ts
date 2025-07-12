import { NextFunction, Request, Response } from "express";
import { config } from "../../config.js";
import { deleteAllUsers } from "../../db/queries/users.js";
import { ForbiddenError } from "../errors.js";

export function metricsHandler(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
    <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
    </body>
    </html>`);
}

export async function resetHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (config.api.platform !== "dev") {
      throw new ForbiddenError("Forbidden");
    }
    config.api.fileServerHits = 0;
    await deleteAllUsers();
    res.send();
  } catch (err) {
    next(err);
  }
}
