import { createConfig, Documentation } from "express-zod-api";
import ui from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";
import { readFile } from "fs/promises";

export const config = createConfig({
  beforeRouting: async ({ app }) => {
    const documentation = yaml.parse(
      await readFile("example.documentation.yaml", "utf-8")
    );
    app.use("/docs", ui.serve, ui.setup(documentation));
  },
  http: {
    listen: 8090, // port, UNIX socket or options
  },
  cors: ({ defaultHeaders, request, endpoint, logger }) => ({
    ...defaultHeaders,
    "Access-Control-Allow-Origin": "*", // Allow all origins or replace with a specific origin
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Specify allowed methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Include 'Authorization' header
    "Access-Control-Max-Age": "5000", // Cache the preflight response for 5000 seconds
  }),
});
