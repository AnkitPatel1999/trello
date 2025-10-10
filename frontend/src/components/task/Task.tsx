import React from 'react';
import type { Card } from '../../domain/types';
import { Status } from '../../domain/status';
import './task.css';

type TaskProps = {
  card: Card;
  allStatuses: Status[];
  onMove: (id: string, to: Status) => void;
};

const Task = ({ card, allStatuses, onMove }: TaskProps) => {
  console.log('Task rendering');
  
  const handleMove = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMove(card.id, e.target.value as Status);
  };

  const initials = card.title.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="task-card">
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
      
      <div className="task-move">
        <label>Move to</label>
        <select value={card.status} onChange={handleMove}>
          {allStatuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Task;
