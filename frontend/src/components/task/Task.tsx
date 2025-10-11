// frontend/src/components/task/Task.tsx
import { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Status, ALL_STATUSES } from '../../domain/status';
import type { Card } from '../../domain/types';
import type { RootState } from '../../store';
import './task.css';
import { STATUS_DISPLAY_NAMES } from '../../domain/phases';

interface TaskProps {
  card: Card;
  onMove: (id: string, to: Status) => void;
}

const Task = memo(({ card, onMove }: TaskProps) => {
  const isSuperUser = useSelector((state: RootState) => state.auth.isSuperUser);

  const handleMove = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onMove(card.id, e.target.value as Status);
  }, [card.id, onMove]);

  // ✅ Memoize initials calculation
  const initials = useMemo(() => 
    card.title.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2),
    [card.title]
  );

  // ✅ Memoize tooltip
  const tooltip = useMemo(() => 
    isSuperUser 
      ? `Created by: ${card.createdBy || 'Unknown'} on ${new Date(card.createdAt || '').toLocaleString()}`
      : undefined,
    [isSuperUser, card.createdBy, card.createdAt]
  );

  // ✅ Memoize dates
  const createdDate = useMemo(() => 
    card.createdAt ? new Date(card.createdAt).toLocaleDateString() : '',
    [card.createdAt]
  );

  const updatedDate = useMemo(() => 
    card.updatedAt ? new Date(card.updatedAt).toLocaleDateString() : null,
    [card.updatedAt]
  );

  return (
    <div className="task-card" title={tooltip}>
      <div className="task-header">
        <div className="task-icon">
          {initials}
        </div>
        <div className="task-title">{card.title}</div>
      </div>

      {card.subtitles && card.subtitles.length > 0 && (
        <ul className="task-subtitles">
          {card.subtitles.map((subtitle, index) => (
            <li key={index} className="task-subtitle">
              {subtitle}
            </li>
          ))}
        </ul>
      )}

      {isSuperUser && (
        <div className="task-super-user-info">
          <div className="super-user-meta">
            <small>Created: {createdDate}</small>
            {updatedDate && (
              <small>Updated: {updatedDate}</small>
            )}
          </div>
        </div>
      )}

      <div className="ae-d-flex ae-gap-5">
        <label>Move to</label>
        <select className='ae-btn ae-btn-outline-dark' value={card.status} onChange={handleMove}>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{STATUS_DISPLAY_NAMES[s]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // ✅ Optimized comparison
  const prevCard = prevProps.card;
  const nextCard = nextProps.card;
  
  return (
    prevCard.id === nextCard.id &&
    prevCard.title === nextCard.title &&
    prevCard.description === nextCard.description &&
    prevCard.status === nextCard.status &&
    prevCard.createdAt === nextCard.createdAt &&
    prevCard.updatedAt === nextCard.updatedAt &&
    prevCard.createdBy === nextCard.createdBy &&
    JSON.stringify(prevCard.subtitles) === JSON.stringify(nextCard.subtitles) &&
    prevProps.onMove === nextProps.onMove
  );
});

Task.displayName = 'Task';

export default Task;