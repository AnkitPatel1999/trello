import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Card } from '../domain/types';
import { Status } from '../domain/status';

type CardsState = {
  cards: Card[];
};

const STORAGE_KEY = 'trello.cards';

function load(): Card[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Card[];
  } catch (_err) {}
  return [];
}

function save(cards: Card[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (_err) {}
}

const initialState: CardsState = {
  cards: load(),
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    hydrateIfEmpty(state) {
      if (state.cards.length === 0) {
        // Get the default project ID from projects store
        const defaultProjectId = 'default-project-id'; // This will be updated when we get the actual project ID
        state.cards = [
          {
            id: crypto.randomUUID(),
            title: 'Task 1',
            description: 'Add buttons to UI, connect APIs, deploy to Azure',
            subtitles: [
              'Add buttons to UI',
              'Connect APIs to UI',
              'Deploy to Azure'
            ],
            status: Status.Proposed,
            projectId: defaultProjectId,
          },
        ];
        save(state.cards);
      }
    },
    addCard(state, action: PayloadAction<{ title: string; status: Status; description?: string; subtitles?: string[]; projectId: string }>) {
      const card: Card = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        description: action.payload.description ?? '',
        subtitles: action.payload.subtitles ?? [],
        status: action.payload.status,
        projectId: action.payload.projectId,
      };
      state.cards.unshift(card);
      save(state.cards);
    },
    moveCard(state, action: PayloadAction<{ id: string; to: Status }>) {
      state.cards = state.cards.map(c => (c.id === action.payload.id ? { ...c, status: action.payload.to } : c));
      save(state.cards);
    },
    deleteCard(state, action: PayloadAction<{ id: string }>) {
      state.cards = state.cards.filter(c => c.id !== action.payload.id);
      save(state.cards);
    },
  },
});

export const { addCard, moveCard, deleteCard, hydrateIfEmpty } = cardsSlice.actions;
export default cardsSlice.reducer;


