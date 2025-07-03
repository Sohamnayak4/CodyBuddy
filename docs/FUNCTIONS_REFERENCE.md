# Functions Reference

This document covers **publicly exported helper functions** found under `src/lib` and `src/models`.  
Internal utilities that are **not exported** (e.g. `processSubmissions` in the Codeforces endpoint) are intentionally omitted.

---

## Table of contents

1. [Authentication helpers (`src/lib/auth.ts`)](#authentication-helpers)
2. [Validation schemas (`src/lib/validation.ts`)](#validation-schemas)
3. [Browser client utilities (`src/lib/client.ts`)](#browser-client-utilities)
4. [Database – User model helpers (`src/models/user.ts`)](#database-user-model-helpers)

---

## Authentication helpers

`import { hashPassword, verifyPassword, generateToken, validateLogin, getUserFromToken } from "@/lib/auth";`

| Function | Signature | Description |
|----------|-----------|-------------|
| `hashPassword` | `(password: string) => Promise<string>` | Hash a plaintext password using **bcryptjs** with 12 salt rounds. |
| `verifyPassword` | `(password: string, hashed: string) => Promise<boolean>` | Compare a plaintext password with a previously-hashed value. |
| `generateToken` | `(userId: string) => Promise<string>` | Create a 24-hour JSON Web Token signed with HS256. The payload is `{ userId }`. |
| `validateLogin` | `({ email, password }: LoginInput) => Promise<User>` | Look up a user by email, verify the password and return the Mongo document. Throws on failure. |
| `getUserFromToken` | `(token: string) => Promise<User>` | Decode and verify a JWT then return the associated user document. |

### Example – Login flow
```ts
import { validateLogin, generateToken } from "@/lib/auth";

const user = await validateLogin({ email, password });
const token = await generateToken(user._id);
```

---

## Validation schemas

The project uses **Zod** to validate request bodies.  
`import { registerSchema, loginSchema } from "@/lib/validation";`

| Schema | Purpose | Example |
|--------|---------|---------|
| `registerSchema` | Ensure a user-registration payload is well-formed. | `registerSchema.parse({ name: "Ada", email: "ada@example.com", password: "secret123" })` |
| `loginSchema` | Validate an email/password pair. | `loginSchema.parse({ email, password })` |

---

## Browser client utilities

`"use client"` – these helpers run in the browser and use the Fetch API.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getUserProfile` | `() => Promise<User>` | Fetches **GET /api/users/me** with the JWT from `localStorage`. Throws on error or if token is missing. |
| `logoutUser` | `() => void` | Removes the JWT from `localStorage`. |

### Example – React usage
```ts
import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/client";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUserProfile().then(setUser).catch(console.error);
  }, []);

  if (!user) return <p>Loading…</p>;
  return <p>Hello {user.name}</p>;
}
```

---

## Database – User model helpers

`import { createUser, findUserByEmail, findUserById, updateUser, deleteUser } from "@/models/user";`

All helpers use the **MongoDB Node.js driver** and operate on the `users` collection.

| Function | Signature | Description |
|----------|-----------|-------------|
| `createUser` | `(user: Omit<User, "_id"\|"createdAt"\|"updatedAt">) => Promise<InsertOneResult>` | Insert a new user document with generated `_id`, `createdAt` and `updatedAt` timestamps. |
| `findUserByEmail` | `(email: string) => Promise<User | null>` | Retrieve a user by unique email address. |
| `findUserById` | `(id: string) => Promise<User | null>` | Retrieve a user by their string `_id`. |
| `updateUser` | `(id: string, update: Partial<User>) => Promise<UpdateResult>` | Partially update a user and refresh the `updatedAt` timestamp. |
| `deleteUser` | `(id: string) => Promise<DeleteResult>` | Permanently remove a user document. |

### Example – Account creation
```ts
import { hashPassword } from "@/lib/auth";
import { createUser } from "@/models/user";

const hashed = await hashPassword(password);
await createUser({ name, email, password: hashed });
```

---

*Last updated: <!-- date will be added by CI/CD or manually -->*