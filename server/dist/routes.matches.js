"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("./middleware");
const matching_1 = require("./matching");
const router = (0, express_1.Router)();
router.get("/listings", middleware_1.authRequired, (req, res) => {
    const results = (0, matching_1.findTopListingsForUser)(req.user.id, 10);
    res.json(results);
});
router.get("/users/:listingId", middleware_1.authRequired, (req, res) => {
    const results = (0, matching_1.findTopUsersForListing)(Number(req.params.listingId), 10);
    res.json(results);
});
exports.default = router;
