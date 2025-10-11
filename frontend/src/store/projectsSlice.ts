// frontend/src/store/projectsSlice.ts
import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '../domain/project';

type ProjectsState = {
  projects: Project[];
  activeProjectId: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: ProjectsState = {
  projects: [],
  activeProjectId: null,
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    setActiveProject(state, action: PayloadAction<string>) {
      state.activeProjectId = action.payload;
    },
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
      state.activeProjectId = action.payload.id;
    },
    updateProject(state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) {
      const project = state.projects.find(p => p.id === action.payload.id);
      if (project) {
        Object.assign(project, action.payload.updates, { updatedAt: new Date().toISOString() });
      }
    },
    deleteProject(state, action: PayloadAction<string>) {
      const projectIndex = state.projects.findIndex(p => p.id === action.payload);
      if (projectIndex !== -1) {
        state.projects.splice(projectIndex, 1);
        if (state.activeProjectId === action.payload) {
          state.activeProjectId = state.projects.length > 0 ? state.projects[0].id : null;
        }
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

// Selectors
export const selectProjects = (state: { projects: ProjectsState }) => state.projects.projects;
export const selectActiveProjectId = (state: { projects: ProjectsState }) => state.projects.activeProjectId;
export const selectActiveProject = createSelector(
  [selectProjects, selectActiveProjectId],
  (projects, activeProjectId) => projects.find(p => p.id === activeProjectId) || null
);
export const selectProjectsLoading = (state: { projects: ProjectsState }) => state.projects.loading;
export const selectProjectsError = (state: { projects: ProjectsState }) => state.projects.error;

export const { 
  setProjects,
  setActiveProject, 
  addProject,
  updateProject, 
  deleteProject,
  setLoading,
  setError
} = projectsSlice.actions;

export default projectsSlice.reducer;