# CodyBuddy – Your Competitive-Programming Companion

![CodyBuddy banner](docs/assets/banner.png)

CodyBuddy is a full-stack web application that **aggregates your competitive-programming progress** across popular platforms – **Codeforces, LeetCode and CodeChef** – into a single, personalised dashboard.

It lets you:

1. Sign-up / sign-in with secure, JWT-based authentication.
2. Connect the handles you use on each supported site.
3. Visualise rating history, problem-solving statistics and recent contest results side-by-side.
4. Disconnect a handle at any time – your account data on the original sites is never modified.
5. Update profile details or permanently delete your CodyBuddy account from the UI.

> CodyBuddy was built to remove the friction of jumping between multiple trackers and give you a bird's-eye view of your growth as a programmer.

---

## Table of Contents

• [Demo](#demo)  
• [Features](#features)  
• [Tech Stack](#tech-stack)  
• [Architecture Overview](#architecture-overview)  
• [Directory Structure](#directory-structure)  
• [Getting Started](#getting-started)  
• [Environment Variables](#environment-variables)  
• [Scripts](#scripts)  
• [API Reference](#api-reference)  
• [Adding New Providers](#adding-new-providers)  
• [Roadmap](#roadmap)  
• [Contributing](#contributing)  
• [License](#license)

---

## Demo

Coming soon — once the public instance is live this section will include a link and screenshots / GIFs of the core flows.

Run it locally by following the quick-start below.

---

## Features

🔐 **Auth** – Email / password registration, login and JWT session management.  
🎯 **Unified dashboard** – See ratings, solved counts, language distribution and more for every platform at a glance.  
🔌 **One-click account linking** – Modal pop-ups allow you to enter your handle once; data is cached in `localStorage`.  
⚡ **Real-time stats** – API routes proxy the official/public endpoints so you are always looking at fresh data.  
🌓 **Responsive UI** – Built with Tailwind CSS and Headless UI; works great on desktop and mobile.  
🗄 **MongoDB persistence** – Stores CodyBuddy users and profile metadata. Your competitive-programming data stays on the original sites.  
🛠 **Typed end-to-end** – TypeScript + Zod schema validation keeps the codebase safe and predictable.

---

## Tech Stack

Frontend             | Backend / API        | Tooling & Utilities
---------------------|----------------------|---------------------
Next.js 15 (App Dir) | Next.js API routes   | TypeScript 5
React 19             | MongoDB Driver 6     | ESLint & Prettier
Tailwind CSS 4       | `bcryptjs` (hashing) | Zod (runtime validation)
Headless UI 2        | `jose` (JWT)         | Vercel Analytics
Heroicons 2          |                      | Jest / React-Testing-Library *(planned)*

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                            Next.js 15                             │
│  ┌───────────────┐                         ┌──────────────────┐  │
│  │  App Router   │   Client Components     │  /api/* routes   │  │
│  └───────▲───────┘        fetch()          └────────┬─────────┘  │
│          │                                         │            │
│          │                        MongoDB (Atlas)  │  Third-Party│
│          │                                         │  APIs       │
│     React 19                                 ┌─────▼──────┐      │
│     + Tailwind CSS                           │  Database  │      │
│                                              └────────────┘      │
└────────────────────────────────────────────────────────────────────┘
```

* **Frontend** – App Router pages render client components that make authenticated fetch calls to the internal API.  
* **API Layer** – `/src/app/api/*` contains RESTful endpoints for auth (`/auth/*`), user CRUD and each competitive-programming provider (`/codeforces`, `/leetcode`, `/codechef`).  
* **Database** – Lightweight collections (`users`) live in MongoDB. A thin wrapper in `src/lib/mongodb.ts` returns a singleton client.  
* **Auth** – Passwords are hashed with `bcryptjs`; JWTs are signed with `jose`. Protection middleware sits in `src/app/api/middleware.ts`.

---

## Directory Structure

```
.
├── src
│   ├── app                 # Next.js App Dir (pages + API routes)
│   ├── components          # Reusable UI blocks
│   ├── context             # Global React contexts (Auth)
│   ├── lib                 # Server-side helpers (Mongo, auth, validation)
│   ├── models              # DB accessors / repositories
│   └── types               # Shared TypeScript types
├── docs                    # Additional reference docs (API, components, functions)
├── public | assets         # Static files (favicons, images)
├── postcss.config.mjs      # Tailwind pipeline
├── tsconfig.json           # TypeScript config
└── …
```

---

## Getting Started

### Prerequisites

* **Node.js ≥ 20** (LTS recommended)  
* **npm ≥ 10** *(or `pnpm`, `yarn`, `bun`)*  
* An accessible **MongoDB** instance (local or [Atlas](https://www.mongodb.com/atlas)).

### Clone & Install

```bash
# 1. Clone the repo
$ git clone https://github.com/your-username/codybuddy.git
$ cd codybuddy

# 2. Install dependencies
$ npm install  # or: pnpm install | yarn | bun install

# 3. Configure environment variables (see below)
$ cp .env.example .env.local && nano .env.local

# 4. Start the dev server
$ npm run dev

# 5. Open http://localhost:3000 in your browser ✨
```

Hot-reloading is provided by the App Router + React Refresh; changes appear instantly.

---

## Environment Variables

Create a `.env.local` file in the project root and set:

```env
# MongoDB connection string – incl. database name
authorization:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/codybuddy?retryWrites=true&w=majority&appName=Cluster0

# Any reasonably long random string
JWT_SECRET=change-me-please
```

> **Security tip:** Never commit real secrets to Git – `.env*` files are excluded by `.gitignore`.

---

## Scripts

| Script          | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start the Next.js development server     |
| `npm run build` | Build the production bundle              |
| `npm start`     | Start the production server (`.next/`)   |
| `npm run lint`  | Run ESLint checks                        |

---

## API Reference

Extensive docs live in [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md).  
Below is a condensed overview:

Endpoint                 | Method | Description
-------------------------|--------|------------
`/api/auth/register`     | POST   | Create a new user account
`/api/auth/login`        | POST   | Obtain JWT token
`/api/users/:id`         | GET    | Retrieve user profile (protected)
`/api/codeforces/:handle`| GET    | Fetch Codeforces stats
`/api/leetcode/:handle`  | GET    | Fetch LeetCode stats
`/api/codechef/:handle`  | GET    | Fetch CodeChef stats

All protected endpoints expect the header: `Authorization: Bearer <token>`.

---

## Adding New Providers

1. Create a new `[username]/route.ts` under `src/app/api/<provider>` that fetches and normalises the remote API.
2. Define strongly-typed interfaces in `src/types/<provider>.ts`.
3. Build a React summary component inside `src/components` + connection modal.
4. Drop the component into the dashboard grid in `src/app/page.tsx`.

The modular boundaries keep additions ergonomic and maintainable.

---

## Roadmap

- [ ] Dark-mode toggle  
- [ ] GraphQL API layer  
- [ ] Social sharing of profiles  
- [ ] Progressive Web App (PWA) support  
- [ ] Native mobile app via Expo / React Native

See the [issues](https://github.com/your-username/codybuddy/issues) for a full backlog.

---

## Contributing

Contributions are welcome and appreciated! If you have an idea, open an [issue](https://github.com/your-username/codybuddy/issues) or create a pull request.

1. Fork the project & clone locally.  
2. Create a feature branch: `git checkout -b my-feature`.  
3. Commit your changes with clear messages.  
4. Push to GitHub and open a PR against `main`.

Please follow the existing coding style and include relevant tests where applicable.

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
