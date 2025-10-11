// frontend/src/components/task/Task.tsx
import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Status } from '../../domain/status';
import type { Card } from '../../domain/types';
import type { RootState } from '../../store';
import './task.css';

interface TaskProps {
  card: Card;
  allStatuses: Status[];
  onMove: (id: string, to: Status) => void;
}

const Task = memo(({ card, allStatuses, onMove }: TaskProps) => {
  console.log('Task rendering:', card.id);
  const isSuperUser = useSelector((state: RootState) => state.auth.isSuperUser);

  const handleMove = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onMove(card.id, e.target.value as Status);
  }, [card.id, onMove]);

  const initials = card.title.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="task-card" title={isSuperUser ? `Created by: ${card.createdBy || 'Unknown'} on ${new Date(card.createdAt || '').toLocaleString()}` : undefined}>
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
            <small>Created: {new Date(card.createdAt || '').toLocaleDateString()}</small>
            {card.updatedAt && (
              <small>Updated: {new Date(card.updatedAt).toLocaleDateString()}</small>
            )}
          </div>
        </div>
      )}

      <div className="">
        <label>Move to</label>
        <select className='ae-btn ae-btn-outline-dark' value={card.status} onChange={handleMove}>
          {allStatuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // ✅ Custom comparison function
  // Only re-render if card data actually changed
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.card.title === nextProps.card.title &&
    prevProps.card.description === nextProps.card.description &&
    prevProps.card.status === nextProps.card.status &&
    prevProps.card.subtitles === nextProps.card.subtitles &&
    prevProps.onMove === nextProps.onMove
  );
});

Task.displayName = 'Task';

export default Task;