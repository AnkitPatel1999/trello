import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Project, CreateProjectRequest } from '../domain/project';

type ProjectsState = {
  projects: Project[];
  activeProjectId: string | null;
};

const STORAGE_KEY = 'trello.projects';
const ACTIVE_PROJECT_KEY = 'trello.activeProject';

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Project[];
  } catch (_err) {}
  return [];
}

function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (_err) {}
}

function loadActiveProjectId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  } catch (_err) {}
  return null;
}

function saveActiveProjectId(projectId: string | null) {
  try {
    if (projectId) {
      localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
    } else {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
  } catch (_err) {}
}

const initialState: ProjectsState = {
  projects: loadProjects(),
  activeProjectId: loadActiveProjectId(),
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    hydrateIfEmpty(state) {
      if (state.projects.length === 0) {
        const defaultProject: Project = {
          id: crypto.randomUUID(),
          name: 'Default Project',
          description: 'Your first project',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
        };
        state.projects = [defaultProject];
        state.activeProjectId = defaultProject.id;
        saveProjects(state.projects);
        saveActiveProjectId(state.activeProjectId);
      }
    },
    createProject(state, action: PayloadAction<CreateProjectRequest>) {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        description: action.payload.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };
      state.projects.push(newProject);
      state.activeProjectId = newProject.id;
      saveProjects(state.projects);
      saveActiveProjectId(state.activeProjectId);
    },
    setActiveProject(state, action: PayloadAction<string>) {
      state.activeProjectId = action.payload;
      saveActiveProjectId(state.activeProjectId);
    },
    updateProject(state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) {
      const project = state.projects.find(p => p.id === action.payload.id);
      if (project) {
        Object.assign(project, action.payload.updates, { updatedAt: new Date().toISOString() });
        saveProjects(state.projects);
      }
    },
    deleteProject(state, action: PayloadAction<string>) {
      const projectIndex = state.projects.findIndex(p => p.id === action.payload);
      if (projectIndex !== -1) {
        state.projects.splice(projectIndex, 1);
        if (state.activeProjectId === action.payload) {
          state.activeProjectId = state.projects.length > 0 ? state.projects[0].id : null;
        }
        saveProjects(state.projects);
        saveActiveProjectId(state.activeProjectId);
      }
    },
  },
});

export const { 
  createProject, 
  setActiveProject, 
  updateProject, 
  deleteProject, 
  hydrateIfEmpty 
} = projectsSlice.actions;

export default projectsSlice.reducer;
