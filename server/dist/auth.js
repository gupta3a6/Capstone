"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.setUserRole = setUserRole;
exports.verifyPassword = verifyPassword;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("./db"));
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
function createUser(email, password, fullName) {
    const passwordHash = bcrypt_1.default.hashSync(password, 10);
    const createdAt = new Date().toISOString();
    const stmt = db_1.default.prepare("INSERT INTO users (email, password_hash, full_name, role, created_at) VALUES (?, ?, ?, NULL, ?)");
    const info = stmt.run(email, passwordHash, fullName, createdAt);
    return info.lastInsertRowid;
}
function findUserByEmail(email) {
    return db_1.default.prepare("SELECT * FROM users WHERE email = ?").get(email);
}
function findUserById(id) {
    return db_1.default.prepare("SELECT * FROM users WHERE id = ?").get(id);
}
function setUserRole(userId, role) {
    db_1.default.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId);
}
function verifyPassword(password, passwordHash) {
    return bcrypt_1.default.compareSync(password, passwordHash);
}
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (_e) {
        return null;
    }
}
