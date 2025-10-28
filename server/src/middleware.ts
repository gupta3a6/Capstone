import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth";

export interface AuthedRequest extends Request {
  user?: { id: number; email: string };
}

export function authRequired(req: AuthedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: "Invalid token" });
  req.user = user;
  next();
}
