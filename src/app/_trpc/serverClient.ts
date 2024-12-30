// server-side rendering on tRPC
import { httpBatchLink } from "@trpc/client";

import { appRouter } from "../server";

// .createCaller can be used on any system, not just React...or it did, once upon a time.
export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: [httpBatchLink({ url: "http://localhost:3000/api/trpc" })],
    }),
  ],
});
