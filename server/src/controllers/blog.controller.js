import Blog from "../models/Blog.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getOne(req, res) {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "blog not found." });
    }
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getAll(req, res) {
  try {
    const blogs = await Blog.find();
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function create(req, res) {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        message:
          "Title , MainImage , and Content are required for creating blog",
      });
    }
    const mainImage = req.files.mainImage[0].filename;
    let contentImages = [];
    req.files.contentImages.map((item) => {
      contentImages.push(item.filename);
    });
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

export async function deleteOne(req, res) {
  try {
    const id = req.params.id;

    // Validate ID parameter
    if (!id) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Find the blog first to get file information
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Store blog title for response message before deletion
    const blogTitle = blog.title;

    // Handle file deletion asynchronously without blocking the response
    if (blog.mainImage || blog.contentImages?.length > 0) {
      deleteBlogFiles(blog.mainImage, blog.contentImages);
    }

    // Delete the blog from database
    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      message: `Blog "${blogTitle}" deleted successfully`,
      deletedBlog: {
        id: blog._id,
        title: blogTitle,
      },
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Helper function to handle file deletion asynchronously
async function deleteBlogFiles(mainImage, contentImages = []) {
  try {
    const filePaths = [];
    const uploadsDir = path.join(process.cwd(), "uploads");

    // Add main image if it exists
    if (mainImage && typeof mainImage === "string") {
      const mainImagePath = path.join(uploadsDir, mainImage);
      if (await fileExists(mainImagePath)) {
        filePaths.push(mainImagePath);
      }
    }

    // Add content images if they exist
    if (Array.isArray(contentImages)) {
      for (const image of contentImages) {
        if (image && typeof image === "string") {
          const contentImagePath = path.join(uploadsDir, image);
          if (await fileExists(contentImagePath)) {
            filePaths.push(contentImagePath);
          }
        }
      }
    }

    // Delete files asynchronously
    if (filePaths.length > 0) {
      Promise.all(
        filePaths.map((filePath) =>
          fs.promises.unlink(filePath).catch((error) => {
            console.warn(`Failed to delete file ${filePath}:`, error.message);
          })
        )
      )
        .then(() => {
          console.log(
            `Successfully deleted ${filePaths.length} files for blog`
          );
        })
        .catch((error) => {
          console.error("Error in file deletion process:", error);
        });
    }
  } catch (error) {
    console.error("Error preparing files for deletion:", error);
  }
}

// Helper function to check if file exists
async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}
