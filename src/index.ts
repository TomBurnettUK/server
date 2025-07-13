import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { metricsHandler, resetHandler } from "./api/handlers/admin.js";
import {
  getChirpHandler,
  getChirpsHandler,
  postChirpsHandler,
} from "./api/handlers/chirps.js";
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

app.post("/api/users", postUsersHandler);

app.post("/api/chirps", postChirpsHandler);

app.get("/api/chirps", getChirpsHandler);

app.get("/api/chirps/:chirpID", getChirpHandler);

app.use(errorHandler);

// Listening...

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
