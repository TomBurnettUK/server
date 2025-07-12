import express, { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogging);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/healthz", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("OK");
});

app.get("/metrics", (req, res) => {
  res.send(`Hits: ${config.fileserverHits}`);
});

app.get("/reset", (req, res) => {
  config.fileserverHits = 0;
  res.send();
});

function middlewareLogging(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    const statusCode = res.statusCode;
    if (statusCode !== 200) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });
  next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  console.log(req.url);
  config.fileserverHits += 1;
  next();
}
