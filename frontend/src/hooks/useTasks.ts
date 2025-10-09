// frontend/src/hooks/useTasks.ts
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { taskService } from '../services/tasks';
import type { Card } from '../domain/types';
import { setCards, addCard, updateCard, deleteCard, setLoading, setError } from '../store/cardsSlice';
import type { RootState } from '../store';

export const useTasks = () => {
  const dispatch = useDispatch();
  const cards = useSelector((state: RootState) => state.cards.cards);
  const loading = useSelector((state: RootState) => state.cards.loading);
  const error = useSelector((state: RootState) => state.cards.error);

  const fetchTasks = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await taskService.getTasks();
      dispatch(setCards(data));
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createTask = useCallback(async (task: Omit<Card, 'id'>) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const newTask = await taskService.createTask(task);
      dispatch(addCard(newTask));
      return newTask;
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateTask = useCallback(async (id: string, task: Partial<Omit<Card, 'id'>>) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const updatedTask = await taskService.updateTask(id, task);
      dispatch(updateCard(updatedTask));
      return updatedTask;
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await taskService.deleteTask(id);
      dispatch(deleteCard(id));
    } catch (err: any) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

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