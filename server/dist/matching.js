"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTopListingsForUser = findTopListingsForUser;
exports.findTopUsersForListing = findTopUsersForListing;
const db_1 = __importDefault(require("./db"));
function scoreAmenities(preferred, actual) {
    if (!preferred)
        return 0.1; // slight base
    const pref = preferred
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    const act = actual
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    const matches = pref.filter((a) => act.includes(a)).length;
    return pref.length === 0 ? 0.1 : matches / pref.length;
}
function findTopListingsForUser(userId, limit = 10) {
    const pref = db_1.default.prepare("SELECT * FROM preferences WHERE user_id = ?").get(userId);
    const listings = db_1.default.prepare("SELECT * FROM listings").all();
    const scored = listings.map((l) => {
        let score = 0;
        if (pref) {
            if (pref.min_bedrooms != null) {
                score += l.bedrooms >= pref.min_bedrooms ? 1 : -1;
            }
            if (pref.max_rent != null) {
                score += l.monthly_rent <= pref.max_rent ? 1 : -1;
            }
            if (pref.desired_city) {
                score += l.city.toLowerCase() === pref.desired_city.toLowerCase() ? 1 : 0;
            }
            if (pref.earliest_start && pref.latest_end) {
                const sOk = new Date(l.start_date) >= new Date(pref.earliest_start);
                const eOk = new Date(l.end_date) <= new Date(pref.latest_end);
                score += sOk && eOk ? 1 : -0.5;
            }
            score += scoreAmenities(pref.amenities, l.amenities);
        }
        // recency bonus
        const ageDays = (Date.now() - new Date(l.created_at).getTime()) / 86400000;
        score += Math.max(0, 1 - ageDays / 30);
        return { listing: l, score };
    });
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.listing);
}
function findTopUsersForListing(listingId, limit = 10) {
    const listing = db_1.default.prepare("SELECT * FROM listings WHERE id = ?").get(listingId);
    if (!listing)
        return [];
    const users = db_1.default.prepare("SELECT * FROM users").all();
    const prefs = db_1.default.prepare("SELECT * FROM preferences").all();
    const userIdToPref = {};
    for (const p of prefs)
        userIdToPref[p.user_id] = p;
    const scored = users
        .filter((u) => u.id !== listing.owner_user_id)
        .map((u) => {
        const pref = userIdToPref[u.id];
        let score = 0;
        if (pref) {
            if (pref.min_bedrooms != null)
                score += listing.bedrooms >= pref.min_bedrooms ? 1 : -1;
            if (pref.max_rent != null)
                score += listing.monthly_rent <= pref.max_rent ? 1 : -1;
            if (pref.desired_city)
                score += listing.city.toLowerCase() === pref.desired_city.toLowerCase() ? 1 : 0;
            if (pref.earliest_start && pref.latest_end) {
                const sOk = new Date(listing.start_date) >= new Date(pref.earliest_start);
                const eOk = new Date(listing.end_date) <= new Date(pref.latest_end);
                score += sOk && eOk ? 1 : -0.5;
            }
            score += scoreAmenities(pref.amenities, listing.amenities);
        }
        // active users bonus (recently created)
        const ageDays = (Date.now() - new Date(u.created_at).getTime()) / 86400000;
        score += Math.max(0, 1 - ageDays / 60);
        return { user: u, score };
    });
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.user);
}
