import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from './cardsSlice';
import projectsReducer from './projectsSlice';

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


