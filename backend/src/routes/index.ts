import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { projectRoutes } from './project.routes';
import { taskRoutes } from './task.routes';
import { notificationRoutes } from './notification.routes';
import { userRoutes } from './user.routes';

export const routes = Router();

// Mount route modules
routes.use('/auth', authRoutes);
routes.use('/projects', projectRoutes);
routes.use('/tasks', taskRoutes);
routes.use('/notifications', notificationRoutes);
routes.use('/users', userRoutes);
