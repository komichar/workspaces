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
  cors: true,
});
