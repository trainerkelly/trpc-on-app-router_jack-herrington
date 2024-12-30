// initial tRPC server
// import the initTRPC function from @trpc/server
import { initTRPC } from "@trpc/server";

// initalize it by storing it a const variable and adding the method .create() to initTRPC.
const t = initTRPC.create();

// export two const variables: the router and the publicProcedure that stores the "t" const with an object being called on it to get that key-value pair. In this case, getting the router and getting the procedure.
export const router = t.router;
export const publicProcedure = t.procedure;
