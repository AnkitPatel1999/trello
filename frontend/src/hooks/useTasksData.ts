// frontend/src/hooks/useTasksData.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/api';
import { setCards, setLoading, setError } from '../store/cardsSlice';
import type { RootState } from '../store';

/**
 * Hook to fetch tasks data once at app level
 * Should only be used in a parent component (Board or App)
 */
export const useTasksData = () => {
  const dispatch = useDispatch();
  const activeProjectId = useSelector((state: RootState) => state.projects.activeProjectId);
  const loading = useSelector((state: RootState) => state.cards.loading);
  const error = useSelector((state: RootState) => state.cards.error);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await apiService.getTasks(activeProjectId || undefined);
        dispatch(setCards(response));
      } catch (err: any) {
        console.error('Failed to fetch tasks:', err);
        dispatch(setError(err.message || 'Failed to fetch tasks'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTasks();
  }, [dispatch, activeProjectId]);

  return { loading, error };
};