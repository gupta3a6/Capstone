import { Router } from "express";
import { authRequired, AuthedRequest } from "./middleware";
import { findTopListingsForUser, findTopUsersForListing } from "./matching";

const router = Router();

router.get("/listings", authRequired, (req: AuthedRequest, res) => {
  const results = findTopListingsForUser(req.user!.id, 10);
  res.json(results);
});

router.get("/users/:listingId", authRequired, (req: AuthedRequest, res) => {
  const results = findTopUsersForListing(Number(req.params.listingId), 10);
  res.json(results);
});

export default router;
