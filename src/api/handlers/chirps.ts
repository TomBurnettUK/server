import { NextFunction, Request, Response } from "express";
import {
  createChirp,
  fetchAllChirps,
  fetchChirp,
} from "../../db/queries/chirps.js";
import { NewChirp } from "../../db/schema.js";
import { BadRequestError } from "../errors.js";

export async function postChirpsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const chirp = req.body;
    const validatedChirp = validateChirp(chirp);
    const addedChirp = await createChirp(validatedChirp);
    res.status(201).json(addedChirp);
  } catch (err) {
    next(err);
  }
}

export async function getChirpsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const chirps = await fetchAllChirps();
    res.json(chirps);
  } catch (err) {
    next(err);
  }
}

export async function getChirpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const chirp = await fetchChirp(req.params.chirpID);
    res.json(chirp);
  } catch (err) {
    next(err);
  }
}

function validateChirp(chirp: NewChirp): NewChirp {
  if (!chirp.userId) {
    throw new BadRequestError("Chirp requires userId");
  }

  if (!chirp.body) {
    throw new BadRequestError("Chirp requires body");
  }

  if (chirp.body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const profanities = ["kerfuffle", "sharbert", "fornax"];
  const chirpWords = chirp.body.split(" ");

  for (let i = 0; i < chirpWords.length; i++) {
    for (const profanity of profanities) {
      if (chirpWords[i].toLowerCase() === profanity) {
        chirpWords[i] = "****";
      }
    }
  }

  chirp.body = chirpWords.join(" ");
  return chirp;
}
