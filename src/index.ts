import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { BadRequestError } from "./api/errors.js";
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

app.get("/admin/metrics", (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
    <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
    </body>
    </html>`);
});

app.post("/admin/reset", (req, res) => {
  config.api.fileServerHits = 0;
  res.send();
});

app.post("/api/validate_chirp", (req, res, next) => {
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

app.use(errorHandler);

// Listening...

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
