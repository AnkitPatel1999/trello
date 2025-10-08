import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from './cardsSlice';
import projectsReducer from './projectsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    projects: projectsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


