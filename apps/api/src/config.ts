import "dotenv/config";
import { createConfig } from "express-zod-api";
import { readFile } from "fs/promises";
import ui from "swagger-ui-express";
import yaml from "yaml";
import { environment } from "./environment.js";

export const config = createConfig({
  beforeRouting: async ({ app, getLogger }) => {
    const documentation = yaml.parse(
      await readFile("./generated-api-swagger-definition.yaml", "utf-8")
    );
    app.use("/docs", ui.serve, ui.setup(documentation));

    getLogger().info(
      `Swagger documentation is available at http://localhost:${environment.LISTEN_PORT}/docs`
    );
  },
  http: {
    listen: environment.LISTEN_PORT,
  },
  cors: ({ defaultHeaders, request, endpoint, logger }) => ({
    ...defaultHeaders,
    "Access-Control-Allow-Origin": "*", // Allow all origins or replace with a specific origin
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Specify allowed methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Include 'Authorization' header
    "Access-Control-Max-Age": "5000", // Cache the preflight response for 5000 seconds
  }),
});
