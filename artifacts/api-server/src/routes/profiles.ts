import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { profilesTable, upsertProfileSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/me", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });
    const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, auth.userId));
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    req.log.error({ err }, "Failed to get own profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const [existing] = await db.select({ id: profilesTable.id }).from(profilesTable).where(eq(profilesTable.username, username.toLowerCase()));
    res.json({ available: !existing });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.username, username.toLowerCase()));
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    req.log.error({ err }, "Failed to get profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });

    const parsed = upsertProfileSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

    const data = parsed.data;
    const username = data.username.toLowerCase();

    const [existing] = await db.select({ id: profilesTable.id, userId: profilesTable.userId }).from(profilesTable).where(eq(profilesTable.username, username));
    if (existing && existing.userId !== auth.userId) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const [ownProfile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, auth.userId));

    if (ownProfile) {
      const [updated] = await db.update(profilesTable).set({
        ...data,
        username,
        updatedAt: new Date(),
      }).where(eq(profilesTable.userId, auth.userId)).returning();
      return res.json(updated);
    } else {
      const [created] = await db.insert(profilesTable).values({
        userId: auth.userId,
        ...data,
        username,
        displayName: data.displayName,
      }).returning();
      return res.status(201).json(created);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to upsert profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
