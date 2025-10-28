import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./db";
import { JwtUser } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function createUser(email: string, password: string, fullName: string) {
  const passwordHash = bcrypt.hashSync(password, 10);
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(
    "INSERT INTO users (email, password_hash, full_name, role, created_at) VALUES (?, ?, ?, NULL, ?)"
  );
  const info = stmt.run(email, passwordHash, fullName, createdAt);
  return info.lastInsertRowid as number;
}

export function findUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function findUserById(id: number) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export function setUserRole(userId: number, role: string | null) {
  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId);
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}

export function signToken(payload: JwtUser) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUser;
  } catch (_e) {
    return null;
  }
}
