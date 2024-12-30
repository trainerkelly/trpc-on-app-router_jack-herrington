import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey(),
  content: text("content"),
  done: integer("done"),
  // sqlite does not have a boolean value, which is why "done" is an integer of either a 0 or a 1
});
