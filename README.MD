# High level intro

This system for reservation of office desks (seats) consists of a REST API and a SPA client web app.

Project requirements details are not publicly available.

## Tech stack overview

Both API and SPA are built using fresh tech from the TypeScript ecosystem:

- Latest node.js LTS 22
- Drizzle ORM
- pnpm 9
- TypeScript 5
- Vite
- Zod

### API tech stack overview

- This REST API is a TypeScript Node.JS application server
- Built using https://www.npmjs.com/package/express-zod-api
- Uses https://zod.dev/ for strong input/output validation
- Nicely integrates with express-zod-api's **automatic swagger** generation, (usually a _true nightmare_ for manual maintenence)
- Allows strongly typed + runtime validated responses.
- The request/response types are `expored` from API and `imported` into the web SPA
- Data layer with Drizzle ORM https://orm.drizzle.team/docs/overview & a local SQLite database
- Local development serving & live reload with `tsx` https://github.com/privatenumber/tsx

### SPA tech stack overview

- Built using Vite https://vite.dev/ and Typescript 5
- Renders using React 18, routed with react-router-dom 6
- Uses https://www.chakra-ui.com/ to pretty good
- Created from this starter https://github.com/bartstc/vite-ts-react-template
- Uses TanStack Query for utilites for fetching,rendering, loading helpers https://tanstack.com/query/latest

# First time setup and running locally

## Part 1/3 - repo root setup

1. clone this repo `git  clone git@github.com:komichar/workspaces.git`
2. cd into the repo root `cd workspaces`
3. run `node -v` and make sure you're running 22, or 20 should be fine.
4. you can use [nvm](https://github.com/nvm-sh/nvm), it reads **.nvmrc** file at repo root and sets correct version. Run `nvm install` and `nvm use` at repo root.
5. run `pnpm -v` and make sure you're running version 9, i used version `9.12.3`. have globally installed https://pnpm.io/installation#on-posix-systems
6. run `pnpm install` from repo root

## Part 2/3 - api setup & running locally

You will need 2 terminal tabs for best workflow - one to run in dev mode, and another to serve the GUI of the database.

For best VS CODE TypeScript intellisense & debugging, I suggest you **do not** work from the repo root, due to tsconfig coverage & integrated terminals opening at the right path.

0. (TIP) I suggest you open the api dir in a **new VS CODE window** `code apps/api/` when working on api.
1. (skip if you followed TIP) from repo root we need move into the **api** dir, run `cd apps/api/` and run following commands:
2. from api dir, run `cp .env.example .env`
3. from api dir, run `pnpm exec drizzle-kit migrate`
4. from api dir, run `pnpm run seed` to get 3 offices and some users, as well as admins
5. from api dir, run `pnpm exec drizzle-kit studio` and it will serve you GUI to manage the database
   ```
   Drizzle Studio is up and running on https://local.drizzle.studio
   ```
   Visit https://local.drizzle.studio and see offices & users
   ![Image](https://github.com/user-attachments/assets/347c554f-987c-4dba-a1b7-a01d6985750b)
6. from api dir, run `pnpm run dev`
7. swagger runs on /docs,
8. when you make significant changes to
9. setting up debugger for VS CODE locally, copy launch.json.example into launch.json & hit F5

## Part 3/3 - api setup & running locally

Similar to recommendation in Part 2/3, here I also suggest opening a new **VS CODE** window `code apps/web/` and working form there.

1. from web dir, run `cp .env.example .env`
2. from web dir, make sure your **.env** file is targeting correct localhost of your api server
3. from web dir, run `pnpm run dev` and it displays the link to open it in the browser

### Building code

1. for api - run `pnpm run build` from apps/api dir
2. for web - run `pnpm run build` from apps/web dir  
   It has a **dual typescript** config. One for local development **tsconfig.json**, and build **tsconfig.build.json** other for building the code for deployment.

   local dev config: tsconfig.json -> can reach & import API codebase
   build config: tsconfig.build.json -> cannot reach API codebase

   The difference between the two is the `include` key - the local development config can see the codebase from the API and import types using `import type` synthax for type safety in the clients side when calling http endpoints.
