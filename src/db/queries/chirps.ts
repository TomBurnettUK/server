import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { Chirp, chirps, NewChirp } from "../../db/schema.js";

export async function createChirp(chirp: NewChirp): Promise<NewChirp> {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}

export async function fetchAllChirps(): Promise<Chirp[]> {
  const result = await db.select().from(chirps);
  return result;
}

export async function fetchChirp(chirpId: string): Promise<Chirp> {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  return result;
}
