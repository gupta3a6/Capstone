"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const db_2 = __importDefault(require("./db"));
const auth_1 = require("./auth");
(0, db_1.migrate)();
function seed() {
    db_2.default.exec("DELETE FROM listings;");
    db_2.default.exec("DELETE FROM preferences;");
    db_2.default.exec("DELETE FROM users;");
    const aliceId = (0, auth_1.createUser)("alice@example.com", "password123", "Alice Sublease");
    const bobId = (0, auth_1.createUser)("bob@example.com", "password123", "Bob Sublessor");
    const carolId = (0, auth_1.createUser)("carol@example.com", "password123", "Carol Seeker");
    // roles
    db_2.default.prepare("UPDATE users SET role = ? WHERE id = ?").run("sublease", aliceId);
    db_2.default.prepare("UPDATE users SET role = ? WHERE id = ?").run("sublessor", bobId);
    db_2.default.prepare("UPDATE users SET role = ? WHERE id = ?").run("sublease", carolId);
    const now = new Date().toISOString();
    const addListing = db_2.default.prepare(`INSERT INTO listings (owner_user_id, title, description, city, monthly_rent, bedrooms, bathrooms, start_date, end_date, amenities, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    addListing.run(bobId, "Sunny 2BR near campus", "Great light, quiet street", "Austin", 1500, 2, 1, "2025-11-01", "2026-05-31", "wifi,parking,laundry", now);
    addListing.run(bobId, "Downtown studio", "Close to transit", "Austin", 1100, 0, 1, "2025-12-01", "2026-03-31", "wifi,elevator,gym", now);
    addListing.run(bobId, "3BR house", "Backyard and garage", "Dallas", 2000, 3, 2, "2025-11-15", "2026-08-31", "parking,laundry,pet-friendly", now);
    const setPref = db_2.default.prepare(`INSERT INTO preferences (user_id, min_bedrooms, max_rent, desired_city, earliest_start, latest_end, amenities, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    setPref.run(aliceId, 1, 1600, "Austin", "2025-11-01", "2026-06-01", "wifi,laundry", now);
    setPref.run(carolId, 2, 1800, "Austin", "2025-11-01", "2026-06-01", "parking,wifi", now);
    console.log("Seeded sample users, preferences, and listings.");
}
seed();
