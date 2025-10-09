// frontend/src/store/cardsSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Card } from '../domain/types';

type CardsState = {
  cards: Card[];
  loading: boolean;
  error: string | null;
};

const initialState: CardsState = {
  cards: [],
  loading: false,
  error: null,
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCards(state, action: PayloadAction<Card[]>) {
      state.cards = action.payload;
    },
    addCard(state, action: PayloadAction<Card>) {
      state.cards.unshift(action.payload);
    },
    updateCard(state, action: PayloadAction<Card>) {
      state.cards = state.cards.map(c => 
        c.id === action.payload.id ? action.payload : c
      );
    },
    deleteCard(state, action: PayloadAction<string>) {
      state.cards = state.cards.filter(c => c.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCards, addCard, updateCard, deleteCard, setLoading, setError } = cardsSlice.actions;
export default cardsSlice.reducer;