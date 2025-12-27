import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import Blog from "../model/blogModel.js";
import fs from "fs";
import path from "path";
import { sanitizeContent } from "../utils/sanitizeHtml.js";

export const createBlog = catchAsyncError(async (req, res, next) => {
  const { title, subTitle, contentHtml, status } = req.body;

  if (!title || !contentHtml) {
    return next(new ErrorHandler(400, "Title & contentHtml required"));
  }

  const cleanHtml = sanitizeContent(contentHtml);

  let image = {};
  if (req.file) {
    image = {
      url: `/uploads/blogs/images/${req.file.filename}`,
      public_id: req.file.filename,
    };
  }

  const blog = await Blog.create({
    title,
    subTitle,
    contentHtml: cleanHtml,
    status,
    image,
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
});

// Get All Blogs
export const getAllBlogs = catchAsyncError(async (req, res, next) => {
  const blogs = await Blog.find({ isdeleted: false });

  res.status(200).json({
    success: true,
    message: "Blogs fetched successfully",
    blogs,
  });
});

// Get Blog by ID
export const getBlogById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return next(new ErrorHandler(404, "Blog not found"));
  }

  res.status(200).json({
    success: true,
    message: "Blog fetched successfully",
    blog,
  });
});

// Update Blog
export const updateBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, subTitle, contentHtml, status } = req.body;

  const blog = await Blog.findById(id);
  if (!blog) return next(new ErrorHandler(404, "Blog not found"));

  if (title) blog.title = title;
  if (subTitle) blog.subTitle = subTitle;
  if (status) blog.status = status;
  if (contentHtml) {
    blog.contentHtml = sanitizeContent(contentHtml);
  }

  if (req.file) {
    blog.image = {
      url: `/uploads/blogs/images/${req.file.filename}`,
      public_id: req.file.filename,
    };
  }

  blog.updatedAt = Date.now();
  await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog,
  });
});

// Delete Blog (soft delete)

// Delete Blog (local image + DB)
export const deleteBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler(404, "Blog not found"));
  }

  // ================= DELETE LOCAL IMAGE =================
  if (blog.image?.url) {
    const imagePath = path.join(
      process.cwd(),
      blog.image.url.replace(/^\/+/, "") // remove leading slash
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // ================= DELETE BLOG =================
  await blog.deleteOne();

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});

// Get Only Published Blogs
export const getPublishedBlogs = catchAsyncError(async (req, res, next) => {
  const blogs = await Blog.find({ status: "published", isdeleted: false });

  if (!blogs || blogs.length === 0) {
    return next(new ErrorHandler(404, "No published blogs found"));
  }

  res.status(200).json({
    success: true,
    message: "Published blogs fetched successfully",
    blogs,
  });
});

// Change Blog Status
export const changeBlogStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["draft", "published"].includes(status)) {
    return next(new ErrorHandler(400, "Invalid status value"));
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler(404, "Blog not found"));
  }

  if (blog.status === status) {
    return next(new ErrorHandler(400, `Blog is already ${status}`));
  }

  blog.status = status;
  blog.updatedAt = Date.now();

  const updatedBlog = await blog.save();

  res.status(200).json({
    success: true,
    message: `Blog status changed to ${status}`,
    blog: updatedBlog,
  });
});
