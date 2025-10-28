import { Router } from "express";
import { z } from "zod";
import db from "./db";
import { authRequired, AuthedRequest } from "./middleware";

const router = Router();

const listingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  city: z.string().min(1),
  monthlyRent: z.number().int().min(0),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  startDate: z.string(),
  endDate: z.string(),
  amenities: z.string().default("")
});

router.get("/", (_req, res) => {
  const rows = db.prepare("SELECT * FROM listings ORDER BY created_at DESC").all();
  res.json(rows);
});

router.post("/", authRequired, (req: AuthedRequest, res) => {
  const parse = listingSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const l = parse.data;
  const now = new Date().toISOString();
  const info = db.prepare(
    `INSERT INTO listings (owner_user_id, title, description, city, monthly_rent, bedrooms, bathrooms, start_date, end_date, amenities, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user!.id, l.title, l.description, l.city, l.monthlyRent, l.bedrooms, l.bathrooms, l.startDate, l.endDate, l.amenities, now);
  const id = info.lastInsertRowid as number;
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(id);
  res.status(201).json(row);
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

router.put("/:id", authRequired, (req: AuthedRequest, res) => {
  const parse = listingSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const l = parse.data as any;
  const row: any = db.prepare("SELECT * FROM listings WHERE id = ?").get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: "Not found" });
  if (row.owner_user_id !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
  db.prepare(
    `UPDATE listings SET title = COALESCE(?, title), description = COALESCE(?, description), city = COALESCE(?, city), monthly_rent = COALESCE(?, monthly_rent), bedrooms = COALESCE(?, bedrooms), bathrooms = COALESCE(?, bathrooms), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), amenities = COALESCE(?, amenities) WHERE id = ?`
  ).run(l.title ?? null, l.description ?? null, l.city ?? null, l.monthlyRent ?? null, l.bedrooms ?? null, l.bathrooms ?? null, l.startDate ?? null, l.endDate ?? null, l.amenities ?? null, row.id);
  const updated = db.prepare("SELECT * FROM listings WHERE id = ?").get(row.id);
  res.json(updated);
});

router.delete("/:id", authRequired, (req: AuthedRequest, res) => {
  const row: any = db.prepare("SELECT * FROM listings WHERE id = ?").get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: "Not found" });
  if (row.owner_user_id !== req.user!.id) return res.status(403).json({ error: "Forbidden" });
  db.prepare("DELETE FROM listings WHERE id = ?").run(row.id);
  res.json({ ok: true });
});

export default router;
