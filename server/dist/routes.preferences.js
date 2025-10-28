"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = __importDefault(require("./db"));
const middleware_1 = require("./middleware");
const router = (0, express_1.Router)();
const prefSchema = zod_1.z.object({
    minBedrooms: zod_1.z.number().int().min(0).nullable().optional(),
    maxRent: zod_1.z.number().int().min(0).nullable().optional(),
    desiredCity: zod_1.z.string().nullable().optional(),
    earliestStart: zod_1.z.string().nullable().optional(),
    latestEnd: zod_1.z.string().nullable().optional(),
    amenities: zod_1.z.string().nullable().optional(),
});
router.get("/", middleware_1.authRequired, (req, res) => {
    const row = db_1.default.prepare("SELECT * FROM preferences WHERE user_id = ?").get(req.user.id);
    if (!row)
        return res.json(null);
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
router.put("/", middleware_1.authRequired, (req, res) => {
    const parse = prefSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const p = parse.data;
    const now = new Date().toISOString();
    const existing = db_1.default.prepare("SELECT id FROM preferences WHERE user_id = ?").get(req.user.id);
    if (existing) {
        db_1.default.prepare(`UPDATE preferences SET min_bedrooms = ?, max_rent = ?, desired_city = ?, earliest_start = ?, latest_end = ?, amenities = ?, updated_at = ? WHERE user_id = ?`).run(p.minBedrooms ?? null, p.maxRent ?? null, p.desiredCity ?? null, p.earliestStart ?? null, p.latestEnd ?? null, p.amenities ?? null, now, req.user.id);
    }
    else {
        db_1.default.prepare(`INSERT INTO preferences (user_id, min_bedrooms, max_rent, desired_city, earliest_start, latest_end, amenities, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(req.user.id, p.minBedrooms ?? null, p.maxRent ?? null, p.desiredCity ?? null, p.earliestStart ?? null, p.latestEnd ?? null, p.amenities ?? null, now);
    }
    return res.json({ ok: true });
});
exports.default = router;
