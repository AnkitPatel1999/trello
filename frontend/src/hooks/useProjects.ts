// frontend/src/hooks/useProjects.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/api';
import type { Project, CreateProjectRequest } from '../domain/project';
import { setProjects, setActiveProject, addProject, updateProject as updateProjectAction, deleteProject as deleteProjectAction, setLoading, setError } from '../store/projectsSlice';
import type { RootState } from '../store';

export const useProjects = () => {
  console.log('useProjects rendering');
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const activeProjectId = useSelector((state: RootState) => state.projects.activeProjectId);
  const loading = useSelector((state: RootState) => state.projects.loading);
  const error = useSelector((state: RootState) => state.projects.error);

  const fetchProjects = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await apiService.getProjects();
      dispatch(setProjects(data));
      
      if (!activeProjectId && data.length > 0) {
        dispatch(setActiveProject(data[0].id));
      }
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createProject = async (project: CreateProjectRequest) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const newProject = await apiService.createProject(project);
      dispatch(addProject(newProject));
      return newProject;
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const updatedProject = await apiService.updateProject(id, updates);
      dispatch(updateProjectAction({ id, updates: updatedProject }));
      return updatedProject;
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteProject = async (id: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await apiService.deleteProject(id);
      dispatch(deleteProjectAction(id));
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const setActiveProjectId = (projectId: string) => {
    dispatch(setActiveProject(projectId));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    activeProjectId,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    setActiveProjectId,
  };
};