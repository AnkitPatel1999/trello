import { Status } from '../../domain/status';
import type { Card } from '../../domain/types';
import "./column.css";

import plus from "../../assets/icons/plus.svg"


type ColumnProps = {
  title: string;
  color: string;
  cards: Card[];
  allStatuses: Status[];
  onAdd: (title: string) => void;
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
          const t = prompt('New card title?');
          if (t && t.trim()) onAdd(t.trim());
        }}>
          <img className='ae-btn-icon' src={plus} alt="" />
          <span className='ae-btn-text'>New</span>
        </button>

      <ul className="cards">
        {cards.map(card => (
          <li key={card.id} className="card">
            <div className="card-title">{card.title}</div>
            {card.description ? <div className="card-desc">{card.description}</div> : null}
            <div className="card-move">
              <label>Move to</label>
              <select value={card.status} onChange={(e) => onMove(card.id, e.target.value as Status)}>
                {allStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Column;