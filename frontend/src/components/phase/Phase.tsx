import React, { memo } from 'react';
import { Status } from '../../domain/status';
import type { Card } from '../../domain/types';
import Task from '../task/Task';
import "./phase.css";

import plus from "../../assets/icons/plus.svg"

type PhaseProps = {
  title: string;
  color: string;
  cards: Card[];
  allStatuses: Status[];
  onAdd: () => void;
  onMove: (id: string, to: Status) => void;
};

const Phase = memo(({ title, color, cards, allStatuses, onAdd, onMove }: PhaseProps) => {
  return (
    <section className="phase" style={{ '--dot-color': color } as React.CSSProperties}>
      <header className="phase-header">
        <h3 className="ae-label phase-title color-dot">{title} </h3>
        <small> {cards.length}</small>
      </header>

      <button className="ae-btn ae-btn-flat ae-gap-5" onClick={onAdd}>
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
});

Phase.displayName = 'Phase';

export default Phase;
