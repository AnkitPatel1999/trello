import type { Card } from '../domain/types';
import { Status, ALL_STATUSES } from '../domain/status';

const STORAGE_KEY = 'trello.cards';

function loadInitialCards(): Card[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Card[];
  } catch (_err) {
    // ignore storage errors; fall back to in-memory
  }
  return [
    {
      id: crypto.randomUUID(),
      title: 'Task #1',
      description: 'Add buttons to UI, connect APIs, deploy to Azure',
      status: Status.Proposed,
    },
  ];
}

let cardsState: Card[] = loadInitialCards();

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsState));
  } catch (_err) {
    // ignore storage errors
  }
}

export async function listCards(): Promise<Card[]> {
  return structuredClone(cardsState);
}

export async function createCard(input: { title: string; status: Status; description?: string }): Promise<Card> {
  const newCard: Card = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description ?? '',
    status: input.status,
  };
  cardsState = [newCard, ...cardsState];
  persist();
  return newCard;
}

export async function moveCard(id: string, to: Status): Promise<void> {
  if (!ALL_STATUSES.includes(to)) return;
  cardsState = cardsState.map(c => (c.id === id ? { ...c, status: to } : c));
  persist();
}

export async function deleteCard(id: string): Promise<void> {
  cardsState = cardsState.filter(c => c.id !== id);
  persist();
}


