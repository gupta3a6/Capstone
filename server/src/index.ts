import express from "express";
import cors from "cors";
import { migrate } from "./db";
import authRoutes from "./routes.auth";
import prefRoutes from "./routes.preferences";
import listingRoutes from "./routes.listings";
import matchRoutes from "./routes.matches";

migrate();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/preferences", prefRoutes);
app.use("/listings", listingRoutes);
app.use("/matches", matchRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
