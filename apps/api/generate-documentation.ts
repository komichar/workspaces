import { writeFile } from "node:fs/promises";
import { config } from "./config";
import { Documentation } from "express-zod-api";
import { routing } from "./routing";

await writeFile(
  "example.documentation.yaml",
  new Documentation({
    routing,
    config,
    version: "1",
    title: "Example API",
    serverUrl: "http://localhost:8090/",
  }).getSpecAsYaml(),
  "utf-8"
);
