import express from "express";
import promClient, { Counter } from "prom-client";

const app = express();

const endpointHitsCounter = new Counter({
  name: "endpoint_hits",
  help: "Number of times an endpoint is hit",
  labelNames: ["endpoint"],
});

app.use((req, res, next) => {
  endpointHitsCounter.labels(req.path).inc();
  next();
});

app.get("/", (req, res) => {
  res.send("mantap");
});

app.get("/users", (req, res) => {
  res.send("mantap user");
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`server running at http://localhost:${PORT}`)
);
