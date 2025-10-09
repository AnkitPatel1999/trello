// frontend/src/services/cards.ts
import { taskService } from './tasks';
import type { Card } from '../domain/types';
import { Status, ALL_STATUSES } from '../domain/status';

export async function listCards(): Promise<Card[]> {
  try {
    return await taskService.getTasks();
  } catch (error) {
    console.error('Failed to fetch tasks from API:', error);
    throw error;
  }
}

export async function createCard(input: { title: string; status: Status; description?: string; projectId: string }): Promise<Card> {
  try {
    return await taskService.createTask({
      title: input.title,
      description: input.description ?? '',
      status: input.status,
      projectId: input.projectId,
      subtitles: [],
    });
  } catch (error) {
    console.error('Failed to create task via API:', error);
    throw error;
  }
}

export async function moveCard(id: string, to: Status): Promise<void> {
  if (!ALL_STATUSES.includes(to)) return;
  
  try {
    await taskService.updateTask(id, { status: to });
  } catch (error) {
    console.error('Failed to update task via API:', error);
    throw error;
  }
}

export async function deleteCard(id: string): Promise<void> {
  try {
    await taskService.deleteTask(id);
  } catch (error) {
    console.error('Failed to delete task via API:', error);
    throw error;
  }
}