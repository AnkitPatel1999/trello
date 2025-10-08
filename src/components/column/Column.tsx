import { Status } from '../../domain/status';
import type { Card } from '../../domain/types';
import Task from '../task/Task';
import "./column.css";

import plus from "../../assets/icons/plus.svg"


type ColumnProps = {
  title: string;
  color: string;
  cards: Card[];
  allStatuses: Status[];
  onAdd: (title: string, subtitles?: string[]) => void;
  onMove: (id: string, to: Status) => void;
};

const Column = ({ title, color, cards, allStatuses, onAdd, onMove }: ColumnProps) => {
  return (
    <section className="column" style={{ '--dot-color': color } as React.CSSProperties}>
      <header className="column-header">
        <h3 className="ae-label column-title color-dot">{title} </h3>
        <small> {cards.length}</small>
       
      </header>

      <button className="ae-btn ae-btn-flat ae-gap-5" onClick={() => {
          const title = prompt('New card title?');
          if (title && title.trim()) {
            const subtitlesInput = prompt('Enter subtitles (comma-separated):');
            const subtitles = subtitlesInput ? subtitlesInput.split(',').map(s => s.trim()).filter(s => s) : [];
            onAdd(title.trim(), subtitles);
          }
        }}>
          <img className='ae-btn-icon' src={plus} alt="" />
          <span className='ae-btn-text'>New</span>
        </button>

      <div className="cards">
        {cards.map(card => (
          <Task
            key={card.id}
            card={card}
            allStatuses={allStatuses}
            onMove={onMove}
          />
        ))}
      </div>
    </section>
  );
};

export default Column;