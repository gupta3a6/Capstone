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
const listingSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    monthlyRent: zod_1.z.number().int().min(0),
    bedrooms: zod_1.z.number().int().min(0),
    bathrooms: zod_1.z.number().int().min(0),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    amenities: zod_1.z.string().default("")
});
router.get("/", (_req, res) => {
    const rows = db_1.default.prepare("SELECT * FROM listings ORDER BY created_at DESC").all();
    res.json(rows);
});
router.post("/", middleware_1.authRequired, (req, res) => {
    const parse = listingSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const l = parse.data;
    const now = new Date().toISOString();
    const info = db_1.default.prepare(`INSERT INTO listings (owner_user_id, title, description, city, monthly_rent, bedrooms, bathrooms, start_date, end_date, amenities, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(req.user.id, l.title, l.description, l.city, l.monthlyRent, l.bedrooms, l.bathrooms, l.startDate, l.endDate, l.amenities, now);
    const id = info.lastInsertRowid;
    const row = db_1.default.prepare("SELECT * FROM listings WHERE id = ?").get(id);
    res.status(201).json(row);
});
router.get("/:id", (req, res) => {
    const row = db_1.default.prepare("SELECT * FROM listings WHERE id = ?").get(Number(req.params.id));
    if (!row)
        return res.status(404).json({ error: "Not found" });
    res.json(row);
});
router.put("/:id", middleware_1.authRequired, (req, res) => {
    const parse = listingSchema.partial().safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const l = parse.data;
    const row = db_1.default.prepare("SELECT * FROM listings WHERE id = ?").get(Number(req.params.id));
    if (!row)
        return res.status(404).json({ error: "Not found" });
    if (row.owner_user_id !== req.user.id)
        return res.status(403).json({ error: "Forbidden" });
    db_1.default.prepare(`UPDATE listings SET title = COALESCE(?, title), description = COALESCE(?, description), city = COALESCE(?, city), monthly_rent = COALESCE(?, monthly_rent), bedrooms = COALESCE(?, bedrooms), bathrooms = COALESCE(?, bathrooms), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), amenities = COALESCE(?, amenities) WHERE id = ?`).run(l.title ?? null, l.description ?? null, l.city ?? null, l.monthlyRent ?? null, l.bedrooms ?? null, l.bathrooms ?? null, l.startDate ?? null, l.endDate ?? null, l.amenities ?? null, row.id);
    const updated = db_1.default.prepare("SELECT * FROM listings WHERE id = ?").get(row.id);
    res.json(updated);
});
router.delete("/:id", middleware_1.authRequired, (req, res) => {
    const row = db_1.default.prepare("SELECT * FROM listings WHERE id = ?").get(Number(req.params.id));
    if (!row)
        return res.status(404).json({ error: "Not found" });
    if (row.owner_user_id !== req.user.id)
        return res.status(403).json({ error: "Forbidden" });
    db_1.default.prepare("DELETE FROM listings WHERE id = ?").run(row.id);
    res.json({ ok: true });
});
exports.default = router;
