import express from 'express';

import {registerUser, loginUser, logoutUser, deleteUser } from '../controller/userController.js';
import {protect, authorizeRoles } from '../middlewares/authMiddleware.js';   
const router = express.Router();

// User Registration Route
router.post('/register', registerUser);
// router.post('/register', (req, res) => {
//   return res.status(403).json({
//     success: false,
//     message: "Registration is currently disabled",
//   });
// });

// User Login Route
router.post('/login', loginUser);

//delete user
router.delete('/user/:id', protect, authorizeRoles("admin"), deleteUser);



export default router;