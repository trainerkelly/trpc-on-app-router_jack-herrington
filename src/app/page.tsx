import TodoList from "./_component/TodoList";
import { serverClient } from "./_trpc/serverClient";

// adding async allows for server side rendering, so all the to-dos can load first before render the page to the client
export default async function Home() {
  const todos = await serverClient.getToDos();
  return (
    <main className="max-w-3xl mx-auto mt-5">
      <TodoList initialTodos={todos} />
    </main>
  );
}
