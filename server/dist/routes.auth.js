"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("./auth");
const middleware_1 = require("./middleware");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    fullName: zod_1.z.string().min(1),
});
router.post("/register", (req, res) => {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { email, password, fullName } = parse.data;
    const exists = (0, auth_1.findUserByEmail)(email);
    if (exists)
        return res.status(409).json({ error: "Email already registered" });
    const userId = (0, auth_1.createUser)(email, password, fullName);
    const token = (0, auth_1.signToken)({ id: userId, email });
    return res.json({ token });
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
router.post("/login", (req, res) => {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { email, password } = parse.data;
    const user = (0, auth_1.findUserByEmail)(email);
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    if (!(0, auth_1.verifyPassword)(password, user.password_hash))
        return res.status(401).json({ error: "Invalid credentials" });
    const token = (0, auth_1.signToken)({ id: user.id, email: user.email });
    return res.json({ token });
});
router.get("/me", middleware_1.authRequired, (req, res) => {
    const u = (0, auth_1.findUserById)(req.user.id);
    if (!u)
        return res.status(404).json({ error: "User not found" });
    return res.json({ id: u.id, email: u.email, fullName: u.full_name, role: u.role });
});
const roleSchema = zod_1.z.object({ role: zod_1.z.enum(["sublessor", "sublease"]).nullable() });
router.post("/role", middleware_1.authRequired, (req, res) => {
    const parse = roleSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    (0, auth_1.setUserRole)(req.user.id, parse.data.role);
    return res.json({ ok: true });
});
exports.default = router;
