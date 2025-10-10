// frontend/src/components/task/Task.tsx
import React, { memo, useCallback } from 'react';
import { Status } from '../../domain/status';
import type { Card } from '../../domain/types';
import './task.css';

interface TaskProps {
  card: Card;
  allStatuses: Status[];
  onMove: (id: string, to: Status) => void;
}

const Task = memo(({ card, allStatuses, onMove }: TaskProps) => {
  console.log('Task rendering:', card.id);

  const handleMove = useCallback((newStatus: Status) => {
    onMove(card.id, newStatus);
  }, [card.id, onMove]);

  return (
    <div className="task-card">
      <h4>{card.title}</h4>
      {card.description && <p>{card.description}</p>}
      
      {/* Your task content */}
      
      <div className="task-actions">
        <select 
          value={card.status} 
          onChange={(e) => handleMove(e.target.value as Status)}
        >
          {allStatuses.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
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