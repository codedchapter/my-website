import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { doubtsTable, doubtAnswersTable, profilesTable, createDoubtSchema, createDoubtAnswerSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

async function getUsername(userId: string): Promise<string | null> {
  const [profile] = await db.select({ username: profilesTable.username }).from(profilesTable).where(eq(profilesTable.userId, userId));
  return profile?.username ?? null;
}

router.get("/", async (req, res) => {
  try {
    const tag = req.query.tag as string | undefined;
    const all = await db.select().from(doubtsTable).orderBy(desc(doubtsTable.createdAt)).limit(50);
    const filtered = tag ? all.filter(d => d.tags.includes(tag)) : all;
    res.json(filtered);
  } catch (err) {
    req.log.error({ err }, "Failed to list doubts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [doubt] = await db.select().from(doubtsTable).where(eq(doubtsTable.id, id));
    if (!doubt) return res.status(404).json({ error: "Doubt not found" });

    const answers = await db.select().from(doubtAnswersTable).where(eq(doubtAnswersTable.doubtId, id)).orderBy(desc(doubtAnswersTable.isAccepted), desc(doubtAnswersTable.createdAt));

    res.json({ ...doubt, answers });
  } catch (err) {
    req.log.error({ err }, "Failed to get doubt");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });

    const parsed = createDoubtSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

    const { title, content, tags } = parsed.data;
    const authorUsername = await getUsername(auth.userId);
    const authorName = (auth.sessionClaims?.fullName as string) || "Anonymous";

    const [created] = await db.insert(doubtsTable).values({
      title,
      content,
      tags: tags ?? [],
      authorId: auth.userId,
      authorName,
      authorUsername,
      isResolved: false,
      answerCount: 0,
    }).returning();

    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to create doubt");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [doubt] = await db.select().from(doubtsTable).where(eq(doubtsTable.id, id));
    if (!doubt) return res.status(404).json({ error: "Not found" });
    if (doubt.authorId !== auth.userId) return res.status(403).json({ error: "Forbidden" });

    await db.delete(doubtAnswersTable).where(eq(doubtAnswersTable.doubtId, id));
    await db.delete(doubtsTable).where(eq(doubtsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete doubt");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/answers", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });

    const doubtId = parseInt(req.params.id);
    if (isNaN(doubtId)) return res.status(400).json({ error: "Invalid id" });

    const [doubt] = await db.select().from(doubtsTable).where(eq(doubtsTable.id, doubtId));
    if (!doubt) return res.status(404).json({ error: "Doubt not found" });

    const parsed = createDoubtAnswerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

    const authorUsername = await getUsername(auth.userId);
    const authorName = (auth.sessionClaims?.fullName as string) || "Anonymous";

    const [answer] = await db.insert(doubtAnswersTable).values({
      doubtId,
      content: parsed.data.content,
      authorId: auth.userId,
      authorName,
      authorUsername,
    }).returning();

    await db.update(doubtsTable).set({
      answerCount: doubt.answerCount + 1,
      updatedAt: new Date(),
    }).where(eq(doubtsTable.id, doubtId));

    res.status(201).json(answer);
  } catch (err) {
    req.log.error({ err }, "Failed to create answer");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/answers/:answerId/accept", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });

    const doubtId = parseInt(req.params.id);
    const answerId = parseInt(req.params.answerId);

    const [doubt] = await db.select().from(doubtsTable).where(eq(doubtsTable.id, doubtId));
    if (!doubt) return res.status(404).json({ error: "Not found" });
    if (doubt.authorId !== auth.userId) return res.status(403).json({ error: "Only the doubt author can accept an answer" });

    await db.update(doubtAnswersTable).set({ isAccepted: false }).where(eq(doubtAnswersTable.doubtId, doubtId));
    const [answer] = await db.update(doubtAnswersTable).set({ isAccepted: true }).where(eq(doubtAnswersTable.id, answerId)).returning();
    await db.update(doubtsTable).set({ isResolved: true, updatedAt: new Date() }).where(eq(doubtsTable.id, doubtId));

    res.json(answer);
  } catch (err) {
    req.log.error({ err }, "Failed to accept answer");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id/answers/:answerId", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });

    const doubtId = parseInt(req.params.id);
    const answerId = parseInt(req.params.answerId);

    const [answer] = await db.select().from(doubtAnswersTable).where(eq(doubtAnswersTable.id, answerId));
    if (!answer) return res.status(404).json({ error: "Not found" });
    if (answer.authorId !== auth.userId) return res.status(403).json({ error: "Forbidden" });

    await db.delete(doubtAnswersTable).where(eq(doubtAnswersTable.id, answerId));

    const [doubt] = await db.select().from(doubtsTable).where(eq(doubtsTable.id, doubtId));
    if (doubt) {
      await db.update(doubtsTable).set({
        answerCount: Math.max(0, doubt.answerCount - 1),
        updatedAt: new Date(),
      }).where(eq(doubtsTable.id, doubtId));
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete answer");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
