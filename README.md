# STEP-BY-STEP OF HOW THIS APP WAS MEANT TO BE BUILT

## NOTES

- Tutorial is by Jack Herrington: https://youtu.be/qCLV0Iaq9zU?si=EMc0hd_FDdetVBZE
- Jack Herrington's GitHub Repo for the Project: https://github.com/jherr/trpc-on-the-app-router/tree/main
- I had trouble with my initial project because I was using the latest versions of everything, so I installed the same Next.js version as was in the video (13.4.16). After that, I went ahead and copied the package.json file on the GitHub repo and installed the files from that in order to have the right versions for the tutorial and to prevent me from running into snags.
- This is a step-by-step to explain the order and other things that went on during the build process for my own future reference.
- folder names will be in ALL CAPS while file names will be in lowercase.fileextension (unless there are uppercase letters in them). _In practice, folder names are generally ALL LOWERCASE – the all-caps is just for this READ-ME file_
- I am writing up this step-by-step so I can look at how each piece is built upon each other. It's kind of hard to tell with just the code itself the steps that were initially taken and how it all came together, so I'm changing that.
- Typescript is used. When I say "types", I'm referring to data types that Typescript checks for to make sure that data type input matches what is expected. That way, if it's expecting a string and you put in a number, it will warn you that you put in a number instead of a string so you can make corrections.
- tRPC is used because it preserves types in both the front and back ends.

## STEP-BY-STEP

### Step 1: Set up Next.js

Set up Next.js with Tailwind CSS and the SRC directory via the terminal. The Next.js setup will prompt setting up Tailwind CSS and the src directory as you go through it.

### Step 2: Remove the Homepage

Inside SRC > APP > page.tsx, go to the Home() component and remove everything except for the <main> tag. Add the Tailwind CSS (max-w-3xl mx-auto mt-5) to <main>.

### Step 3: Add Relevant Libraries

Next.js will serve both the pages and the tRPC endpoints.

Add via CLI:

- pnpm add @trpc/server (tRPC server package)
- pnpm add @trpc/client @trpc/react-query @tanstack/react-query (tRPC client code for running queries; the tanstack react-query is used on top of the tRPC react-query, though the video provides no explanation of why that choice was made. It may have been presumed that the person checking out the video would know why)

### Step 4: Initialize tRPC Server

Initialize the tRPC server through creating a sever folder and placing a file called "trpc.ts" inside with the relevant code.
SRC > APP > SERVER > trpc.ts

See file for code.

### Step 5: Create tRPC Router

The tRPC router is created in the same SERVER folder. The name of the file is index.ts.
So: SRC > APP > SERVER > index.ts

See file for code.

The app router is imported from trpc.ts and is setup in its own const variable that holds all the functions that are going to routed via tRPC. The initial function set is getToDos. It is written like a key-value pair. The initial data put in is just dummy data to make sure the querying works. (Querying is fetching the data to be displayed.)

### Step 6: Connecting to the Route to the AppRouter

In order for the tRPC router to connect with the Next.js App Router, a route first must be created via folder in the app directory that will route request to the tRPC instance (Herrington, "tRPC + NextJS App Router = Simple Typesafe APIs" @ Timestamp 3:23 – 3:35).

Create a directory called API. Inside API, put another directory called TRPC. Inside of that, create a directory that is called [TRPC]. Then create a route handler file called route.ts.(SRC > APP > API > TRPC > [TRPC] > route.ts)

The [TRPC] folder is a dynamic route that will update based on the function or data that is being passed to it. In the case of this application, it is the getToDos function that is being passed. It can be seen in action via the endpoint at http://localhost:3000/api/trpc/getToDos.

route.ts is set up with an adapter called "fetchRequestHandler" in order to fetch requests using the App Router (as opposed to the Pages Router in Next.js). You will not have to write additional functions in order for the fetching to happen. You only need to update the .index.ts file with the relevant functions.

### Step 7: Setting up tRPC Client

Create a new directory called \_TRPC. Inside it, place a file called client.ts. (SRC > APP > \_TRPC > client.ts)

The \_ in front of \_TRPC indicates that the file is NOT a route and is inaccessible as a page.

client.ts is set up to import createTRPCReact from tRPC's react-query package, as well as the type list from AppRouter for typesafety via TypeScript. Then a const storing a function being called that is exported is created called trpc. It holds the createTRPCReact inside of it and holds the type list for the AppRouter beside it in <>. Empty braces are passed as an argument in the actual function. See code to know what I am talking about.

Hover over the methods, variables, etc.. to see the types (data types).

### Step 8: Setting up the Provider and Client

Create a new file in \_TRPC called "Provider.tsx". (SRC > APP > \_TRPC > Provider.tsx).

The file is set up to use the react-query to query the client and store it inside of useState. The same thing happens with trpcClient.

The react-query client creates a new QueryClient({}). The tRPC client creates a new client (trpc.createClient) and passes through a key-value pair for linking to URLs. The URL is the localhost endpoint for the tRPC api (http://localhost:3000/api/trpc).

This is a file that includes a component using the Provider, both tRPC and React-Query Client. The "children" variable that displays information is used here and wrapped inside of the provider. See the code for more details.

### Step 9: Create the To List Component

Create a new folder called \_COMPONENTS and add the file "TodoList.tsx". (SRC > APP > \_COMPONENTS > TodoList.tsx). This component (TodoList.tsx) hosts the To Do application in its entierity.

Create the component using export default function called TodoList(). Instead of the {}, create a const called "getTodos" and use trpc.getTodos and use the method .useQuery() on it in order to fetch the data.

To display the dummy data, return the HTML (in this case, 2 <div> layers) with the JSON data stringified inside of {}. (JSON.stringify(getTodos.data))

Add the ToDoList component to Page.tsx.

### Step 10: Set Up Drizzle ORM with SQLite

Import the packages via package manager of choice (npm, pnpm, etc..):

- pnpm add drizzle-orm better-sqlite3
- pnpm add @types/better-sqlite3 (for typesafety)

#### Step 10.1: Set Up Drizzle Schema

The Drizzle schema defines how the database tables are set up.

Set up a folder in SRC called DB and place the schema.ts file into it. (SRC > DB > schema.ts).

Setup the table for "todos" and add the id,the content, and whether or not the task is done. See the code for the exact schema set up. For this tutorial, "done" is decided with a 0 and a 1 (number) because SQLite does NOT have a boolean value.

#### Step 10.2: Set Up Drizzle Configuration File

In the root folder (whatever your main project directory is – in my case, it's TRPC-ON-APP-ROUTER_JACK-HERRINGTON), create a file called "drizzle.config.ts".

Import the packages via package manager of choice (npm, pnpm, etc..):

- pnpm add drizzle-kit

Import the Config type from drizzle-kit. Define an object with the key-value pairs. The key-value pairs are:

- schema (location of schema file)
- out (location of the migration files, JSON & schema snapshots: https://orm.drizzle.team/docs/drizzle-config-file#out)
- driver (explicitly defines the database driver: https://orm.drizzle.team/docs/drizzle-config-file#driver)
- dbCredentials (the credientals for logging into a database: https://orm.drizzle.team/docs/drizzle-config-file#dbcredentials)

#### Step 10.3: Run the First Migration

Migrations update the database's schema. It is responsible for updating, creating, and removing tables, rows, and columns. For Drizzle ORM, this is done via Drizzle Kit. (https://orm.drizzle.team/docs/kit-overview)

Migrations are run via the CLI. Run the following command:

- pnpm drizzle-kit generate:sqlite

(If error occures regarding 'Transforming const to the configured target environment ("es5") is not supported yet', go to the tsconfig file and update the target to es6. It just means that TypeScript was trying to put out ES5 instead of ES6 and it ran into problems.)

Files can be accessed in the DRIZZLE directory. The migration SQL will be available there.

### Step 11: Connect Drizzle with tRPC

Go to SRC > SERVER > index.ts.

At the top of the file, add the imports for the following:

- drizzle from drizzle-orm/better-sqlite3 (the connection for the database)
- migrate from drizzle-orm/better-sqlite3/migrator (sets up the database tables/rows/columns; automatically runs whenever the app is run)
- Database from better-sqlite3 (the actual database being used)

Additionally:

- add the schema (todos) from db/schema

#### Step 11.1: Set up SQLite Database

Create a const variable called "sqlite" and store a new database inside of it using the keyword "new" plus the function Database(). Pass the parameter of "sqlite.db" to initialize the database. See code for setup.

#### Step 11.2: Connect the SQLite DB and Drizzle Together

Create a const variable called "db" and store the function drizzle() inside of it. The pass it the "sqlite" variable as an arguement. See code for setup.

#### Step 11.3: Update Dummy Data to Query Database

Remove the dummy data provided in getTodos and instead replace the return with await db.select().from(todos).all() to query all the todos.

### Step 12: Ability to Add Tasks

#### Step 12.1: Add zod

Inside of the CLI, use the command to download package "zod" in order to validate inputs.

- pnpm add zod

Import z from zod at the top of the index.ts file.

#### Step 12.2: Add new function

Create a new function inside of the router list. This is called "addToDo".

Inside of addToDo, add the publicProcedure. Put the method ".input()" on it in order to get the input. Pass it "z.string" as an argument to validate the input as a string. After that, add on the method ".mutation" in order to indicate that it's "mutating" (i.e. changing) the data, as opposed to querying (searching) for it. Pass it an async arrow function with the parameter of "opts" (options). For the actual function, await the database and use .insert() with "todos" passed as an argument because it is being inserted into that specific table. After that, add on the method .values() with a key-value pair object passed through it. The content is opts.input (the input from options) and setting it being done as 0. (See code for how this is set up.)

"content" from the database schema, as does done. Opts is whatever the input ends up being. It holds the content inside of it.

#### Step 12.3: Testing & Forcing Auto-Refresh

If the site is not already open, open it via the CLI on localhost (I usually run "npm run dev" to get it to launch). Type inside of the input and hit the "Add Todo" button to see if the raw JSON data shows up in the empty array. If it does, it worked PERFECTLY!! If not, there was a problem.

New data does not automatically show. The page has to be manually refreshed. This can be fixed by going to SRC > APP > \_COMPONENTS > TodoList.tsx, adding the addTodo function to the list and use the .useMutation() method on it. Pass a JavaScript object as an argument containing the onSettled event. Create a key-value pair with "onSettled". The value is an arrow function that contains the refetching of getTodos with the .refetch method. (See code for how this is setup)

### Step 13: Style with Tailwind & Format Data

Style components with Tailwind as desired.

Format the data by using <input /> tag with the attributes of id, type, checked, and style. All by type are in between {}.

(See code for how this is setup)

### Step 14: Check Box to Indicate DONE Status

Add a route procedure in SRC > SERVER > index.ts.

The route procedure is called "setDone". After calling the public procedure, it takes the input (gets the id of whatever is being targeted and the done value) and mutates it to the numbers 0 or 1 to indicate that it's done. It returns the boolean value of "true". (See code for how this is laid out.)

"eq" from drizzle-orm is to be imported at the top of the file.

Once that is set up, go back to SRC > APP > \_COMPONENTS > TodoList.tsx. Add the relevant const variable to host the setDone function that will refetch once the mutation is done.

To the <input /> tag, add an onChange attribute. Set the "setDone" to mutate based on the id and checking if the done value is set to 0 or 1, then flip it depending on what the answer is. (See the code for setup.)

### Step 15: Server-Side Rendering

In order to prevent the screen from flashing when the data is refetched, server-side rendering needs to be enabled.

Inside of \_TRPC, add a serverClient.ts.
(SRC > APP > \_TRPC > serverClient.ts)

Import:

- httpBatchLink from tRPC/client
- appRouter from /server

Create an export const variable called "serverClient" that stores the appRouter with the metho .createCaller() in it. Pass it the argument of the httpBatchLink that links to the localhost port with the api/trpc. (See file for setup.)

Inside of the page.tsx (SRC > APP > page.tsx), turn the Home() component into an async function. Create a new const variable inside of the component function called "todos" and add the "await" keyword and the serverClient (import it first from the serverClient.ts file) with the method .getTodos().

In the <TodoList /> component, add the prop "initialTodos" and have it equal {todos}. It will not function at this point because the prop is not available in the TodoList component yet.

Go back to the TodoList component (SRC > APP > \_COMPONENT > TodoList.tsx) and inside of the component function's parameters, pass it the object with the key-value pairs of "initialToDos". Add the type to it to ensure typesafety using the serverClient as a typeof. (See the code for the setup.) Add the "Awaited" keyword before the <ReturnType> in order to indicate that it was a Promise that was already awaited.

Then go down to the const variable "getTodo" and pass the argument of "undefined" and the Javascript object of initialData: initialTodos to the .useQuery() method.

It will have eliminated flicker.

### Step 16: Eliminate Client-Side Re-Rendering

If you take a look at the Network inspecter, you can see that the page is being re-rendered on the client. This is an unnecessary step. It can be prevente by going to the getTodos const and in the object passed with initialData: initialTodos, also add in refetchOnMount: false and refetchOnReconnect: false. (See code for how it's setup.) It will only re-render when having some new added to it.
