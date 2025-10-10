import React, { useState } from 'react';
import { Status } from '../../domain/status';
import type { Card } from '../../domain/types';
import Task from '../task/Task';
import TaskModal from '../taskmodal/TaskModal';
import "./phase.css";

import plus from "../../assets/icons/plus.svg"

type PhaseProps = {
  title: string;
  color: string;
  cards: Card[];
  allStatuses: Status[];
  status: Status;
  onMove: (id: string, to: Status) => void;
};

const Phase = ({ title, color, cards, allStatuses, status, onMove }: PhaseProps) => {
  console.log('Phase rendering');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    console.log('Button clicked, opening modal');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  console.log('Phase render, isModalOpen:', isModalOpen);

  return (
    <>
      <section className="phase" style={{ '--dot-color': color } as React.CSSProperties}>
        <header className="phase-header">
          <h3 className="ae-label phase-title color-dot">{title} </h3>
          <small> {cards.length}</small>
        </header>

        <button className="ae-btn ae-btn-flat ae-gap-5" onClick={handleAdd}>
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

      {isModalOpen && (
        <TaskModal 
          open={isModalOpen}
          onClose={handleCloseModal}
          status={status}
        />
      )}
    </>
  );
};

export default Phase;
