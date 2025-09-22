import Blog from "../models/Blog.js";

export async function getOne(req, res) {}

export async function getAll(req, res) {
  try {
    const blogs = await Blog.find();
    return res.status(200).json({ blogs });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error. Recieving blogs failed." });
  }
}

export async function create(req, res) {
  try {
    const { title, mainImage, content, contentImages } = req.body;
    if (!title || !mainImage || !content) {
      return res.status(400).json({
        message:
          "Title , MainImage , and Content are required for creating blog",
      });
    }
    const newBlog = new Blog({
      title,
      mainImage,
      content,
      contentImages,
    });
    await newBlog.save();
    return res
      .status(200)
      .json({ message: "New Blog created successfully", createdBlog: newBlog });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function update(req, res) {}

export async function deleteOne(req, res) {}
