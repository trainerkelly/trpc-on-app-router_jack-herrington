"use client";
import { useState } from "react";

import { trpc } from "../_trpc/client"; // allows trpc to be used inside of the client component which then displays the to-do list items
// trpc preserves the types including from the schema to ensure that the entire project stays consistently typesafe

export default function TodoList({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>;
}) {
  const getTodos = trpc.getToDos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false, // prevents refetching on the client when the server already refetched the data – only will refetch when the data is updated
    refetchOnReconnect: false, // prevents refetching on the client when the server already refetched the data – only will refetch when the data is updated
  }); // uses useQuery hook from React – it is used to fetch data and quires a key and a function
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  }); // mutates the data based on the input in the app. Once the data is in the database (onSettled), it will automatically refetch the data and get the list of to-dos
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  }); // updates the data (i.e. mutates it) to set the task as "done". Automatically updates with useMutation with the event of onSettled – it refetches that data to display it.

  const [content, setContent] = useState("");
  return (
    <div>
      <div className="text-white my-5 text-3xl">
        {getTodos?.data?.map((todo) => (
          <div key={todo.id} className="flex gap-3 items-center">
            <input
              id={`check-${todo.id}`}
              type="checkbox"
              checked={!!todo.done}
              style={{ zoom: 1.5 }}
              onChange={async () => {
                setDone.mutate({
                  id: todo.id,
                  done: todo.done ? 0 : 1,
                });
              }}
            />
            <label htmlFor={`check-${todo.id}`}>{todo.content}</label>
          </div>
        ))}
      </div>
      <div className="flex gap-3 items-center">
        <label htmlFor="content">Content</label>
        <input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-black"
        />
        <button
          onClick={async () => {
            // checks if the content is more than zero
            if (content.length) {
              addTodo.mutate(content);
              setContent("");
            }
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}
