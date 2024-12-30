import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { z } from "zod"; // library to validate input of items entering the database

import { publicProcedure, router } from "./trpc";

import { todos } from "@/db/schema"; // used to make all the request

// sets up the database & route to database
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle" }); // migration of database

// creates the appRouter from the trpc.ts. Add functions to the router, such as getting "to do's" from a to-do list
export const appRouter = router({
  getToDos: publicProcedure.query(async () => {
    // return the database query (async'd)
    return await db.select().from(todos).all();
  }),
  addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
    await db.insert(todos).values({ content: opts.input, done: 0 }).run();
    return true;
  }),
  setDone: publicProcedure
    .input(
      z.object({
        id: z.number(),
        done: z.number(),
      })
    )
    .mutation(async (opts) => {
      await db
        .update(todos)
        .set({ done: opts.input.done })
        .where(eq(todos.id, opts.input.id))
        .run();
      return true;
    }),
});

export type AppRouter = typeof appRouter;
