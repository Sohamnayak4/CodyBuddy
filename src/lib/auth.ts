import { hash, compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { findUserByEmail, findUserById } from "@/models/user";
import type { LoginInput } from "./validation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function generateToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { userId: string };
  } catch {
    throw new Error("Invalid token");
  }
}

export async function validateLogin({ email, password }: LoginInput) {
  const user = await findUserByEmail(email);
  
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
}

export async function getUserFromToken(token: string) {
  const { userId } = await verifyToken(token);
  const user = await findUserById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
