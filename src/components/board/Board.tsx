import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Column from './Column';
import { COLUMNS } from '../../domain/columns';
import { Status, ALL_STATUSES } from '../../domain/status';
import type { Card } from '../../domain/types';
import { addCard, moveCard as moveCardAction, hydrateIfEmpty } from '../../store/cardsSlice';
import type { RootState } from '../../store';

const Board = () => {
  const dispatch = useDispatch();
  const cards = useSelector((state: RootState) => state.cards.cards as Card[]);

  useEffect(() => {
    dispatch(hydrateIfEmpty());
  }, [dispatch]);

  const handleAdd = (title: string, status: Status) => {
    dispatch(addCard({ title, status }));
  };

  const handleMove = (id: string, to: Status) => {
    dispatch(moveCardAction({ id, to }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(220px, 1fr))`, gap: 16 }}>
      {COLUMNS.map(cfg => (
        <Column
          key={cfg.key}
          title={cfg.title}
          color={cfg.badgeColor}
          cards={cards.filter((c: Card) => c.status === cfg.key)}
          allStatuses={ALL_STATUSES}
          onAdd={(title) => handleAdd(title, cfg.key)}
          onMove={handleMove}
        />
      ))}
    </div>
  );
}

export default Board