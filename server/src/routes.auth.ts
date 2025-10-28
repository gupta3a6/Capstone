import { Router } from "express";
import { z } from "zod";
import db from "./db";
import { createUser, findUserByEmail, signToken, verifyPassword, setUserRole, findUserById } from "./auth";
import { authRequired, AuthedRequest } from "./middleware";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
});

router.post("/register", (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password, fullName } = parse.data;
  const exists = findUserByEmail(email);
  if (exists) return res.status(409).json({ error: "Email already registered" });
  const userId = createUser(email, password, fullName);
  const token = signToken({ id: userId, email });
  return res.json({ token });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password } = parse.data;
  const user: any = findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  if (!verifyPassword(password, user.password_hash)) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken({ id: user.id, email: user.email });
  return res.json({ token });
});

router.get("/me", authRequired, (req: AuthedRequest, res) => {
  const u: any = findUserById(req.user!.id) as any;
  if (!u) return res.status(404).json({ error: "User not found" });
  return res.json({ id: u.id, email: u.email, fullName: u.full_name, role: u.role });
});

const roleSchema = z.object({ role: z.enum(["sublessor", "sublease"]).nullable() });
router.post("/role", authRequired, (req: AuthedRequest, res) => {
  const parse = roleSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  setUserRole(req.user!.id, parse.data.role);
  return res.json({ ok: true });
});

export default router;
