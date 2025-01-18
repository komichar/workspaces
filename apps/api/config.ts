import { createConfig } from "express-zod-api";

export const config = createConfig({
  http: {
    listen: 8090, // port, UNIX socket or options
  },
  cors: true,
});
