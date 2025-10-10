// frontend/src/hooks/useTasks.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/api';
import type { Card } from '../domain/types';
import { setCards, addCard, updateCard, deleteCard, setLoading, setError } from '../store/cardsSlice';
import type { RootState } from '../store';

export const useTasks = () => {
  console.log('useTasks rendering');
  const dispatch = useDispatch();
  const cards = useSelector((state: RootState) => state.cards.cards);
  const loading = useSelector((state: RootState) => state.cards.loading);
  const error = useSelector((state: RootState) => state.cards.error);

  const fetchTasks = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await apiService.getTasks();
      dispatch(setCards(data));
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createTask = async (task: Omit<Card, 'id'>) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const newTask = await apiService.createTask(task);
      dispatch(addCard(newTask));
      return newTask;
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateTask = async (id: string, task: Partial<Omit<Card, 'id'>>) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const updatedTask = await apiService.updateTask(id, task);
      dispatch(updateCard(updatedTask));
      return updatedTask;
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteTask = async (id: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await apiService.deleteTask(id);
      dispatch(deleteCard(id));
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks: cards,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};