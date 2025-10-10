// frontend/src/hooks/useTasks.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/api';
import type { Card } from '../domain/types';
import { setCards, addCard, updateCard, deleteCard, setLoading, setError } from '../store/cardsSlice';
import type { RootState } from '../store';

export const useTasks = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.cards.cards);
  const loading = useSelector((state: RootState) => state.cards.loading);
  const error = useSelector((state: RootState) => state.cards.error);

  // ✅ Memoize updateTask to prevent recreating on every render
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
  const createTask = useCallback(async (taskData: Partial<Card>) => {
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

  return {
    tasks,
    loading,
    error,
    updateTask,
    createTask,
    deleteTask
  };
};