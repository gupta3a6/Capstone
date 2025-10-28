"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const routes_auth_1 = __importDefault(require("./routes.auth"));
const routes_preferences_1 = __importDefault(require("./routes.preferences"));
const routes_listings_1 = __importDefault(require("./routes.listings"));
const routes_matches_1 = __importDefault(require("./routes.matches"));
(0, db_1.migrate)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", routes_auth_1.default);
app.use("/preferences", routes_preferences_1.default);
app.use("/listings", routes_listings_1.default);
app.use("/matches", routes_matches_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
