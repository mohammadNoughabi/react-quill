import express from "express";

import blogRouter from "./blog.routes.js";

const router = express.Router();

router.use("/blog", blogRouter);

export default router;
