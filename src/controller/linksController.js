import Link from "../model/linksModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create a new social media link
export const createLink = catchAsyncError(async (req, res, next) => {
  const { category, url } = req.body;

  if (!category || !url) {
    return next(new ErrorHandler(400, "Category and URL are required"));
  }

  const newLink = await Link.create({ category, url });

  res.status(201).json({
    success: true,
    message: "Link created successfully",
    data: newLink,
  });
});

// Get all social media links, optionally filtered by category
export const getLinks = catchAsyncError(async (req, res, next) => {
  const { category } = req.query;

  const filter = category ? { category } : {};
  const links = await Link.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: links.length,
    data: links,
  });
});

// Delete a link by ID
export const deleteLink = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const link = await Link.findById(id);
  if (!link) {
    return next(new ErrorHandler(404, "Link not found"));
  }

  await link.deleteOne();

  res.status(200).json({
    success: true,
    message: "Link deleted successfully",
  });
});
