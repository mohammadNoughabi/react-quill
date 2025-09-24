import express from "express";

import upload from "../utils/upload.js";

import {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
} from "../controllers/blog.controller.js";

const blogRouter = express.Router();

blogRouter.get("/get-one/:id", getOne);
blogRouter.get("/get-all", getAll);
blogRouter.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "contentImages" },
  ]),
  create
);
blogRouter.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "contentImages" },
  ]),
  update
);
blogRouter.delete("/:id", deleteOne);

export default blogRouter;
