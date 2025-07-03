# API Reference

This document lists **all publicly exposed HTTP API endpoints** in the project.  
The base URL assumes the application is running locally at `http://localhost:3000`.

> ℹ️  All endpoints that require authentication expect a JSON Web Token (JWT) to be supplied in the `Authorization` header using the **Bearer** scheme:
>
> ```http
> Authorization: Bearer <jwt>
> ```
>
> A token can be obtained via the **POST /api/auth/login** or **POST /api/auth/register** routes.

---

## Table of contents

1. [Authentication](#authentication)
   1. [POST /api/auth/register](#post-apiauthregister)
   2. [POST /api/auth/login](#post-apiauthlogin)
   3. [POST /api/auth/verify](#post-apiauthverify)
2. [Users](#users)
   1. [GET /api/users](#get-apiusers)
   2. [PUT /api/users](#put-apiusers)
   3. [DELETE /api/users](#delete-apiusers)
   4. [GET /api/users/me](#get-apiusersme)
   5. [GET /api/users/:id](#get-apiusersid)
   6. [PUT /api/users/:id](#put-apiusersid)
   7. [DELETE /api/users/:id](#delete-apiusersid)
3. [Competitive-Programming Profiles](#competitive-programming-profiles)
   1. [GET /api/codechef/:username](#get-apicodechefname)
   2. [GET /api/codeforces/:username](#get-apicodeforcesusername)
   3. [GET /api/leetcode/:username](#get-apileetcodeusername)

---

## Authentication

### POST /api/auth/register
Create a new user account and immediately receive an authentication token.

```http
POST /api/auth/register HTTP/1.1
Content-Type: application/json

{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "CorrectHorseBatteryStaple"
}
```

Successful response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "<jwt>",
  "user": {
    "_id": "64ee97e…",
    "name": "Ada Lovelace",
    "email": "ada@example.com"
  }
}
```

Errors:
* **400** – Email already registered / Validation failed.

---

### POST /api/auth/login
Authenticate an existing user.

```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "ada@example.com",
  "password": "CorrectHorseBatteryStaple"
}
```

Successful response:

```json
{
  "token": "<jwt>",
  "user": { "_id": "…", "name": "Ada Lovelace", "email": "ada@example.com" }
}
```

Errors:
* **400** – Invalid credentials / Validation failed.

---

### POST /api/auth/verify
Verify a token obtained from **login** or **register**.

```http
POST /api/auth/verify HTTP/1.1
Content-Type: application/json

{
  "token": "<jwt>"
}
```

Response body contains the decoded user information or **401** on invalid token.

---

## Users

### GET /api/users
Return the profile of the **authenticated** user.

```http
GET /api/users HTTP/1.1
Authorization: Bearer <jwt>
```

Response:

```json
{
  "user": { "_id": "…", "name": "Ada", "email": "ada@example.com" }
}
```

Errors:
* **401** – Missing/invalid token

---

### PUT /api/users
Update the authenticated user's profile.

```http
PUT /api/users HTTP/1.1
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "Countess of Lovelace",
  "email": "countess@example.com"
}
```

Updates the supplied fields and returns the updated document.

Errors:
* **400** – Email already taken / Validation failed.
* **401** – Missing token

---

### DELETE /api/users
Permanently delete the authenticated user's account.

```http
DELETE /api/users HTTP/1.1
Authorization: Bearer <jwt>
```

Response:

```json
{ "message": "User account deleted successfully" }
```

---

### GET /api/users/me
Syntactic sugar for **GET /api/users** – identical behaviour.

---

### GET /api/users/:id
Return a public-profile of the user specified by `:id`.

```http
GET /api/users/649… HTTP/1.1
Authorization: Bearer <jwt>
```

Errors:
* **404** – User not found

---

### PUT /api/users/:id
Update **your own** document by ID. Same payload and response as **PUT /api/users**.

Authorization logic ensures you can only update your own record – a **403** error is returned otherwise.

---

### DELETE /api/users/:id
Delete **your own** document by ID. Returns **403** if you attempt to delete somebody else.

---

## Competitive-Programming Profiles
These endpoints are *proxy* endpoints that fetch publicly-available profile data from third-party APIs and return it unchanged (or lightly massaged for convenience). They **do not require authentication**.

### GET /api/codechef/:username
Fetch CodeChef statistics for the given handle.

Example:
```http
GET /api/codechef/tourist
```

Returns the JSON structure provided by https://codechef-api.vercel.app.

---

### GET /api/codeforces/:username
Retrieve Codeforces user info, submissions (up to 1,000) and rating history combined in a single object.

Example:
```http
GET /api/codeforces/tourist
```

Response snippet:
```json
{
  "user": { "handle": "tourist", "rating": 3900, … },
  "submissions": [ { "id": 18…, "verdict": "OK", … } ],
  "ratingChanges": [ { "contestId": 17…, "newRating": 3900, … } ],
  "problemStats": {
    "totalSolved": 1680,
    "byTags": { "dp": 321, … },
    "byRating": { "800": 133, … },
    "verdictCounts": { "OK": 1900, "WRONG_ANSWER": 82, … },
    "languageCounts": { "GNU C++17": 1780, … }
  }
}
```

---

### GET /api/leetcode/:username
Returns LeetCode profile information plus a `submissionCalendar` map keyed by day.

Example:
```http
GET /api/leetcode/leetcode-handle
```

```json
{
  "totalSolved": 605,
  "submissionCalendar": { "1691193600": 2, … },
  …
}
```

---

## Error format
All error responses share the same shape:

```json
{ "error": "Human-readable description" }
```

The HTTP status code provides the canonical error categorisation (400, 401, 403, 404, 500, etc.).