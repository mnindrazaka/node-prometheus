import express from "express";
import { Counter, Gauge, register } from "prom-client";
import os from "os";

const app = express();

const endpointHitsCounter = new Counter({
  name: "endpoint_hits",
  help: "Number of times an endpoint is hit",
  labelNames: ["endpoint"],
});

const cpuUsageGauge = new Gauge({
  name: "cpu_usage",
  help: "CPU usage in percentage",
});

setInterval(() => {
  const cpuUsage =
    os.cpus().reduce((acc, cpu) => acc + cpu.times.user, 0) / os.cpus().length;
  cpuUsageGauge.set(cpuUsage);
}, 5000);

app.use((req, _res, next) => {
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
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`server running at http://localhost:${PORT}`)
);
