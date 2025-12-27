import express from 'express';
import {
  createLink,
  getLinks,
  deleteLink
} from '../controller/linksController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new link (only admin or authorized role)
router.post('/social-links', protect, authorizeRoles("admin"), createLink);

// Get all links or filter by category (public access)
router.get('/social-links', getLinks);

// Delete a link by ID (only admin or authorized role)
router.delete('/social-links/:id', protect, authorizeRoles("admin"), deleteLink);

export default router;
