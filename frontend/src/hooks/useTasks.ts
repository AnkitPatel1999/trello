// frontend/src/hooks/useTasks.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/api';
import type { Card } from '../domain/types';
import { setCards, addCard, updateCard, deleteCard } from '../store/cardsSlice';
import type { RootState } from '../store';

/**
 * Hook for task CRUD operations
 * Can be used in any component without triggering data fetch
 */
export const useTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.cards.cards);

  // ✅ Memoize updateTask
  const updateTask = useCallback(async (id: string, updates: Partial<Card>) => {
    try {
      const response = await apiService.updateTask(id, updates);
      dispatch(updateCard(response));
      return response;
    } catch (err) {
      console.error('Update task error:', err);
      throw err;
    }
  }, [dispatch]);

  // ✅ Memoize createTask
  const createTask = useCallback(async (taskData: Omit<Card, 'id'>) => {
    try {
      const response = await apiService.createTask(taskData);
      dispatch(addCard(response));
      return response;
    } catch (err) {
      console.error('Create task error:', err);
      throw err;
    }
  }, [dispatch]);

  // ✅ Memoize deleteTask
  const deleteTask = useCallback(async (id: string) => {
    try {
      await apiService.deleteTask(id);
      dispatch(deleteCard(id));
    } catch (err) {
      console.error('Delete task error:', err);
      throw err;
    }
  }, [dispatch]);

  // ✅ Manual refresh function (optional)
  const refreshTasks = useCallback(async () => {
    try {
      const response = await apiService.getTasks();
      dispatch(setCards(response));
    } catch (err) {
      console.error('Refresh tasks error:', err);
      throw err;
    }
  }, [dispatch]);

  return {
    tasks,
    updateTask,
    createTask,
    deleteTask,
    refreshTasks
  };
};