"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = authRequired;
const auth_1 = require("./auth");
function authRequired(req, res, next) {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token)
        return res.status(401).json({ error: "Missing token" });
    const user = (0, auth_1.verifyToken)(token);
    if (!user)
        return res.status(401).json({ error: "Invalid token" });
    req.user = user;
    next();
}
