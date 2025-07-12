import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { BadRequestError } from "./api/errors.js";
import { metricsHandler, resetHandler } from "./api/handlers/admin.js";
import { postChirpsHandler } from "./api/handlers/chirps.js";
import { postUsersHandler } from "./api/handlers/users.js";
import {
  errorHandler,
  middlewareLogging,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { config } from "./config.js";

// DB migrations

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// Create express app

const app = express();

// Middleware registration

app.use(express.json());
app.use(middlewareLogging);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// Routes

app.get("/api/healthz", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("OK");
});

app.get("/admin/metrics", metricsHandler);

app.post("/admin/reset", resetHandler);

app.post("/api/validate_chirp", (req, res) => {
  const { body }: { body: string } = req.body;

  if (body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const profanities = ["kerfuffle", "sharbert", "fornax"];
  const bodyWords = body.split(" ");

  for (let i = 0; i < bodyWords.length; i++) {
    for (const profanity of profanities) {
      if (bodyWords[i].toLowerCase() === profanity) {
        bodyWords[i] = "****";
      }
    }
  }

  const cleanedBody = bodyWords.join(" ");

  return res.status(200).json({ cleanedBody });
});

app.post("/api/users", postUsersHandler);

app.post("/api/chirps", postChirpsHandler);

app.use(errorHandler);

// Listening...

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
