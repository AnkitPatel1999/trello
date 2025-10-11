// frontend/src/components/phase/Phase.tsx
import React, { useState, useCallback, memo } from 'react';
import { Status } from '../../domain/status';
import type { Card } from '../../domain/types';
import Task from '../task/Task';
import TaskModal from '../taskmodal/TaskModal';
import { useTasksData } from '../../hooks/useTasksData';
import "./phase.css";
import plus from "../../assets/icons/plus.svg"

type PhaseProps = {
  title: string;
  color: string;
  cards: Card[];
  allStatuses: Status[];
  status: Status;
  fontColor: string;
  onMove: (id: string, to: Status) => void;
};

const Phase = memo(({ title, color, fontColor, cards, allStatuses, status, onMove }: PhaseProps) => {
  console.log('Phase rendering:', title);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error } = useTasksData();


  const handleAdd = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <section className="phase" style={{ '--dot-color': color } as React.CSSProperties}>
        <header className="phase-header">
          <h3 className="ae-label phase-title color-dot" style={{ color: fontColor }}>{title}</h3>
          <small>{cards.length}</small>
        </header>

        <button className="ae-btn ae-btn-flat ae-gap-5" onClick={handleAdd}>
          <img className='ae-btn-icon' src={plus} alt="" />
          <span className='ae-btn-text'>New</span>
        </button>

        {loading && Array.from({ length: 2 }, (_, index) => (
          <div className="cards" key={`shimmer-${index}`}>
            <div className="task-card">
            <div className="ae-shimmer ca-task-name"></div>
              {loading && Array.from({ length: 2 }, (_, index) => (
                <>
                  <div className="cs-subtask">
                    <div className="ae-shimmer ca-task-thumbnail"></div>
                    <div className="ae-shimmer ca-task-subtitle"></div>
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}

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
}, (prevProps, nextProps) => {
  // ✅ Only re-render if cards array reference or length changed
  return (
    prevProps.cards === nextProps.cards &&
    prevProps.title === nextProps.title &&
    prevProps.onMove === nextProps.onMove
  );
});

Phase.displayName = 'Phase';

export default Phase;