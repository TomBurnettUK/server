import express, { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogging);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/api/healthz", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("OK");
});

app.get("/admin/metrics", (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
});

app.get("/admin/reset", (req, res) => {
  config.fileserverHits = 0;
  res.send();
});

function middlewareLogging(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    if (res.statusCode !== 200) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );
    }
  });
  next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.fileserverHits += 1;
  next();
}
