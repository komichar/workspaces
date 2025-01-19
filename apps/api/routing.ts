import { defaultEndpointsFactory, Routing } from "express-zod-api";
import { z } from "zod";

const helloWorldEndpoint = defaultEndpointsFactory.build({
  // method: "get" (default) or array ["get", "post", ...]
  input: z.object({
    name: z.string().optional(),
  }),
  output: z.object({
    greetings: z.string(),
  }),
  handler: async ({ input: { name }, options, logger }) => {
    logger.debug("Options:", options); // middlewares provide options
    return { greetings: `Hello, ${name || "World"}. Happy coding!` };
  },
});

export const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
  },
};
