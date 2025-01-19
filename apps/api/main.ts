import { createServer } from "express-zod-api";
import { config } from "./config";
import { routing } from "./routing";

console.log("Starting server...");

await createServer(config, routing);
