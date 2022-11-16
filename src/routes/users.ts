import { UsersMongoDao } from "../dao/models/mongo/UsersMongoDao";
import { Router } from "express";

const router = Router();
const users = new UsersMongoDao();

router.get("/", async (_req, res) => {
  const data = await users.findMany();
  res.json({ data });
});

export default router;
