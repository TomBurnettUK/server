import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { DBUser, NewUser, users } from "../schema.js";

export async function createUser(user: NewUser): Promise<DBUser> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function fetchUserByEmail(email: string): Promise<DBUser> {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function deleteAllUsers() {
  await db.delete(users);
}
