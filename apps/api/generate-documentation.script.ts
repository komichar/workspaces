import { writeFile } from "node:fs/promises";
import { config } from "./src/config.js";
import { Documentation } from "express-zod-api";
import { routing } from "./src/routing.js";

await writeFile(
  "generated-api-swagger-definition.yaml",
  new Documentation({
    routing,
    config,
    version: "1",
    title: "Example API",
    serverUrl: "http://localhost:8090/",
  }).getSpecAsYaml(),
  "utf-8"
);
