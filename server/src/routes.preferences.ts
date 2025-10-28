import { Router } from "express";
import { z } from "zod";
import db from "./db";
import { authRequired, AuthedRequest } from "./middleware";

const router = Router();

const prefSchema = z.object({
  minBedrooms: z.number().int().min(0).nullable().optional(),
  maxRent: z.number().int().min(0).nullable().optional(),
  desiredCity: z.string().nullable().optional(),
  earliestStart: z.string().nullable().optional(),
  latestEnd: z.string().nullable().optional(),
  amenities: z.string().nullable().optional(),
});

router.get("/", authRequired, (req: AuthedRequest, res) => {
  const row: any = db.prepare("SELECT * FROM preferences WHERE user_id = ?").get(req.user!.id) as any;
  if (!row) return res.json(null);
  return res.json({
    id: row.id,
    minBedrooms: row.min_bedrooms,
    maxRent: row.max_rent,
    desiredCity: row.desired_city,
    earliestStart: row.earliest_start,
    latestEnd: row.latest_end,
    amenities: row.amenities,
    updatedAt: row.updated_at,
  });
});

router.put("/", authRequired, (req: AuthedRequest, res) => {
  const parse = prefSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const p = parse.data;
  const now = new Date().toISOString();
  const existing: any = db.prepare("SELECT id FROM preferences WHERE user_id = ?").get(req.user!.id) as any;
  if (existing) {
    db.prepare(
      `UPDATE preferences SET min_bedrooms = ?, max_rent = ?, desired_city = ?, earliest_start = ?, latest_end = ?, amenities = ?, updated_at = ? WHERE user_id = ?`
    ).run(p.minBedrooms ?? null, p.maxRent ?? null, p.desiredCity ?? null, p.earliestStart ?? null, p.latestEnd ?? null, p.amenities ?? null, now, req.user!.id);
  } else {
    db.prepare(
      `INSERT INTO preferences (user_id, min_bedrooms, max_rent, desired_city, earliest_start, latest_end, amenities, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(req.user!.id, p.minBedrooms ?? null, p.maxRent ?? null, p.desiredCity ?? null, p.earliestStart ?? null, p.latestEnd ?? null, p.amenities ?? null, now);
  }
  return res.json({ ok: true });
});

export default router;
