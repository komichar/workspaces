import { createServer } from "express-zod-api";
import { config } from "./config.js";
import { routing } from "./routing.js";

console.log("Starting server...");

await createServer(config, routing);
