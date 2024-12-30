// _name (folder) is ignored by the App Router for routing (i.e. inaccessible by going to /) – so it won't be shown as a route

import { createTRPCReact } from "@trpc/react-query";

// imports the TS types to make it typesafe
// if you hover over the types, you can see the functions inside of the router on index.ts. This demonstrates how the apps are being typed via the route.
import { type AppRouter } from "../server";

// creates the React client. Creates the tRPC React by using the react-query library. The <> just defines what types it's supposed to have.
export const trpc = createTRPCReact<AppRouter>({});
