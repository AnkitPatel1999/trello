import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';
import { Project } from '../models/Project.model';
import { generateId } from '../utils/helpers';

export class ProjectController {
  createProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { name, description } = req.body;
    const userId = req.user!.id;

    try {
      const project = await Project.create({
        name,
        description,
        userId,
        isActive: true,
      });

      logger.info('Project created', { projectId: project._id, userId, name });

      ApiResponse.created(res, 'Project created successfully', {
        id: project._id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        isActive: project.isActive,
      });
    } catch (error) {
      logger.error('Failed to create project', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        name,
      });
      ApiResponse.internalServerError(res, 'Failed to create project');
    }
  });

  getProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Remove userId filter - show all active projects
      const projects = await Project.find({ isActive: true })
        .sort({ createdAt: -1 })
        .select('_id name description createdAt updatedAt isActive userId');

      const formattedProjects = projects.map(project => ({
        id: project._id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        isActive: project.isActive,
        createdBy: project.userId, // Add creator info
      }));

      ApiResponse.success(res, 'Projects retrieved successfully', formattedProjects);
    } catch (error) {
      logger.error('Failed to get projects', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      ApiResponse.internalServerError(res, 'Failed to retrieve projects');
    }
  });

  getProjectById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {
      // Remove user ownership check
      const project = await Project.findOne({ _id: id, isActive: true });

      if (!project) {
        ApiResponse.notFound(res, 'Project not found');
        return;
      }

      ApiResponse.success(res, 'Project retrieved successfully', {
        id: project._id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        isActive: project.isActive,
        createdBy: project.userId, // Add creator info
      });
    } catch (error) {
      logger.error('Failed to get project', {
        error: error instanceof Error ? error.message : 'Unknown error',
        projectId: id,
      });
      ApiResponse.internalServerError(res, 'Failed to retrieve project');
    }
  });

  updateProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user!.id;

    try {
      const project = await Project.findOneAndUpdate(
        { _id: id, userId, isActive: true },
        { name, description, updatedAt: new Date() },
        { new: true }
      );

      if (!project) {
        ApiResponse.notFound(res, 'Project not found');
        return;
      }

      logger.info('Project updated', { projectId: id, userId, name });

      ApiResponse.success(res, 'Project updated successfully', {
        id: project._id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        isActive: project.isActive,
      });
    } catch (error) {
      logger.error('Failed to update project', {
        error: error instanceof Error ? error.message : 'Unknown error',
        projectId: id,
        userId,
      });
      ApiResponse.internalServerError(res, 'Failed to update project');
    }
  });

  deleteProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
      const project = await Project.findOneAndUpdate(
        { _id: id, userId, isActive: true },
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!project) {
        ApiResponse.notFound(res, 'Project not found');
        return;
      }

      logger.info('Project deleted', { projectId: id, userId });

      ApiResponse.success(res, 'Project deleted successfully');
    } catch (error) {
      logger.error('Failed to delete project', {
        error: error instanceof Error ? error.message : 'Unknown error',
        projectId: id,
        userId,
      });
      ApiResponse.internalServerError(res, 'Failed to delete project');
    }
  });
}
