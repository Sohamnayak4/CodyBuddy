import { ObjectId } from "mongodb";
import client from "@/lib/mongodb";
import User from "@/types/user";

const db = client.db();
const users = db.collection<User>("users");

export async function createUser(user: Omit<User, "_id" | "createdAt" | "updatedAt">) {
  const now = new Date();
  const result = await users.insertOne({
    ...user,
    _id: new ObjectId().toString(),
    createdAt: now,
    updatedAt: now,
  });
  return result;
}

export async function findUserByEmail(email: string) {
  return users.findOne({ email });
}

export async function findUserById(id: string) {
  return users.findOne({ _id: id });
}

export async function updateUser(id: string, update: Partial<User>) {
  const result = await users.updateOne(
    { _id: id },
    { 
      $set: {
        ...update,
        updatedAt: new Date()
      }
    }
  );
  return result;
}

export async function deleteUser(id: string) {
  const result = await users.deleteOne({ _id: id });
  return result;
}
