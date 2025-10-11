// frontend/src/components/phase/Phase.tsx
import { useState, useCallback, memo } from 'react';
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
  status: Status;
  fontColor: string;
  onMove: (id: string, to: Status) => void;
  loading: boolean;
};

const Phase = memo(({ title, color, fontColor, cards, status, onMove,loading }: PhaseProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              {Array.from({ length: 2 }, (_, subIndex) => (
                <div key={`subtask-${index}-${subIndex}`} className="cs-subtask">
                  <div className="ae-shimmer ca-task-thumbnail"></div>
                  <div className="ae-shimmer ca-task-subtitle"></div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="cards">
          {cards.map(card => (
            <Task
              key={card.id}
              card={card}
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
  // ✅ Deep comparison for cards array
  if (prevProps.cards.length !== nextProps.cards.length) return false;
  if (prevProps.title !== nextProps.title) return false;
  if (prevProps.onMove !== nextProps.onMove) return false;
  
  // Check if cards array content changed
  for (let i = 0; i < prevProps.cards.length; i++) {
    if (prevProps.cards[i].id !== nextProps.cards[i].id ||
        prevProps.cards[i].status !== nextProps.cards[i].status ||
        prevProps.cards[i].title !== nextProps.cards[i].title) {
      return false;
    }
  }
  
  return true;
});

Phase.displayName = 'Phase';

export default Phase;