import { fetchRequestHandler } from "@trpc/server/adapters/fetch"; // adapter used for the App Router in Next.js – if more functions are needed, add them to index.ts
import { appRouter } from "@/app/server";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
