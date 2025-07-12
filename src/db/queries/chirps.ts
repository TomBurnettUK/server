import { db } from "../../db/index.js";
import { chirps, NewChirp } from "../../db/schema.js";

export async function createChirp(chirp: NewChirp): Promise<NewChirp> {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}
