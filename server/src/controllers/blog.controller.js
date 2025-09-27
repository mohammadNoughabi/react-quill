import Blog from "../models/Blog.js";
import fs from "fs";
import path from "path";

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

    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res
        .status(400)
        .json({ message: "This blog already exists. Choose another title." });
    }

    const mainImage = req.files.mainImage[0].filename;
    let contentImages = [];
    if (req.files.contentImages) {
      req.files.contentImages.map((item) => {
        contentImages.push(item.filename);
      });
    }

    const newBlog = new Blog({
      title,
      mainImage,
      content,
      contentImages,
    });
    await newBlog.save();
    return res.status(200).json({
      message: `Blog ${title} created successfully`,
      createdBlog: newBlog,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function update(req, res) {
  try {
    const id = req.params.id;
    const { title, content } = req.body;

    // Validate blog ID
    if (!id) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Find existing blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Prepare update object
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    // Handle main image update
    let filesToDelete = [];
    if (req.files?.mainImage?.[0]?.filename) {
      filesToDelete.push(blog.mainImage); // Store old main image for deletion
      updateData.mainImage = req.files.mainImage[0].filename;
    }

    // Handle content images update
    if (req.files?.contentImages?.length > 0) {
      filesToDelete.push(...blog.contentImages); // Store old content images for deletion
      updateData.contentImages = req.files.contentImages.map(
        (item) => item.filename
      );
    }

    // Update blog in database
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Delete old files if new ones were uploaded
    if (filesToDelete.length > 0) {
      try {
        await deleteBlogFiles(
          filesToDelete.includes(blog.mainImage) ? blog.mainImage : null,
          filesToDelete.filter((file) => blog.contentImages.includes(file))
        );
      } catch (fileError) {
        console.error("File deletion failed:", fileError);
        // Continue with response but log file deletion issue
      }
    }

    return res.status(200).json({
      message: `Blog "${updatedBlog.title}" updated successfully`,
      updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteOne(req, res) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const blogTitle = blog.title;

    // Delete files if they exist
    if (blog.mainImage || blog.contentImages?.length > 0) {
      try {
        await deleteBlogFiles(blog.mainImage, blog.contentImages);
      } catch (fileError) {
        console.error("File deletion failed:", fileError);
        // Continue with database deletion but inform client of file issue
      }
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      message: `Blog "${blogTitle}" deleted successfully`,
      deletedBlog: { id: blog._id, title: blogTitle },
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteBlogFiles(mainImage, contentImages = []) {
  try {
    const filePaths = [];
    const uploadsDir = path.join(process.cwd(), "/src/uploads");

    if (mainImage && typeof mainImage === "string") {
      const mainImagePath = path.join(uploadsDir, path.basename(mainImage));
      console.log(`Checking main image: ${mainImagePath}`);
      if (await fileExists(mainImagePath)) {
        filePaths.push(mainImagePath);
      } else {
        console.warn(`Main image not found: ${mainImagePath}`);
      }
    }

    if (Array.isArray(contentImages)) {
      for (const image of contentImages) {
        if (image && typeof image === "string") {
          const contentImagePath = path.join(uploadsDir, path.basename(image));
          console.log(`Checking content image: ${contentImagePath}`);
          if (await fileExists(contentImagePath)) {
            filePaths.push(contentImagePath);
          } else {
            console.warn(`Content image not found: ${contentImagePath}`);
          }
        }
      }
    } else {
      console.warn("contentImages is not an array:", contentImages);
    }

    console.log(filePaths);

    if (filePaths.length > 0) {
      await Promise.all(
        filePaths.map((filePath) =>
          fs.promises.unlink(filePath).catch((error) => {
            console.error(`Failed to delete file ${filePath}:`, error.message);
          })
        )
      );
      console.log(`Successfully deleted ${filePaths.length} files`);
    }
  } catch (error) {
    console.error("Error preparing files for deletion:", error);
    throw error;
  }
}

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}
