import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  updateBlog,
  changeBlogStatus,
  deleteBlog,
} from '../controller/blogsController.js';

import { uploadBlogMedia } from "../middlewares/uploadBlogMedia.js";
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new blog post (only doctor and admin roles)
router.post('/blog', protect, authorizeRoles("doctor", "admin"), uploadBlogMedia, createBlog);

// Get all blogs (admin or doctor roles, includes drafts)
router.get('/blogs', protect, authorizeRoles("admin", "doctor"), getAllBlogs);

// Get only published blogs (public access, no authentication required)
router.get('/published-blogs', getPublishedBlogs);

// Get blog by ID (public access)
router.get('/blog/:id', getBlogById);

// Update blog (only doctor and admin roles)
router.put('/blog/:id', protect, authorizeRoles("doctor", "admin"), uploadBlogMedia, updateBlog);

// Change blog status (draft <-> published) (only doctor and admin roles)
router.put('/blog/:id/status', protect, authorizeRoles("doctor", "admin"), changeBlogStatus);

// Delete blog (only admin and doctor roles)
router.delete('/blog/:id', protect, authorizeRoles("admin", "doctor"), deleteBlog);

export default router;
