// TaskRoute.js
import express from 'express';
import { verifyToken, isAdmin } from '../middleware/TokenMiddleware.js';
import {
    getAllUserTasks,
    createTask,
    getUserTasks,
    updateTask,
    deleteTask,
    updateTaskStatus,
    deleteUser
} from '../controllers/TaskController.js';

const router = express.Router();

// Admin routes
router.get('/admin/tasks', verifyToken, isAdmin, getAllUserTasks);
router.post('/admin/tasks', verifyToken, isAdmin, createTask);
router.put('/admin/tasks/:taskId', verifyToken, isAdmin, updateTask);
router.delete('/admin/tasks/:taskId', verifyToken, isAdmin, deleteTask);
router.delete('/admin/users/:userId', verifyToken, isAdmin, deleteUser);

// User routes
router.get('/tasks', verifyToken, getUserTasks);
router.put('/tasks/:taskId/status', verifyToken, updateTaskStatus);

export default router;