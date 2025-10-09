// frontend/src/components/board/Board.tsx
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Phase from '../phase/Phase';
import { TaskModalWithSuspense } from '../lazy/LazyModals';
import { PHASES } from '../../domain/phases';
import { Status, ALL_STATUSES } from '../../domain/status';
import type { Card } from '../../domain/types';
import { useTasks } from '../../hooks/useTasks';
import type { RootState } from '../../store';
import './board.css';

import tabler_icon2 from "../../assets/icons/tabler_icon2.svg"
import right_icon from "../../assets/icons/right_icon.svg"

const Board = () => {
  const dispatch = useDispatch();
  const activeProjectId = useSelector((state: RootState) => state.projects.activeProjectId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<Status>(Status.Proposed);
  const hasFetchedRef = useRef(false);
  
  const { tasks, loading, error, fetchTasks, updateTask } = useTasks();

  // Memoize filtered cards to prevent unnecessary recalculations
  const cards = useMemo(() => 
    tasks.filter(task => task.projectId === activeProjectId),
    [tasks, activeProjectId]
  );

  // Memoize task count
  const taskCount = useMemo(() => cards.length, [cards]);

  // Memoize cards grouped by status to prevent recalculation on every render
  const cardsByStatus = useMemo(() => {
    const grouped: Record<Status, Card[]> = {} as Record<Status, Card[]>;
    PHASES.forEach(phase => {
      grouped[phase.key] = cards.filter(card => card.status === phase.key);
    });
    return grouped;
  }, [cards]);

  useEffect(() => {
    if (activeProjectId && !hasFetchedRef.current) {
      fetchTasks();
      hasFetchedRef.current = true;
    }
  }, [activeProjectId, fetchTasks]);

  // Memoize modal handlers
  const handleOpenModal = useCallback((status: Status) => {
    setModalStatus(status);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Memoize task move handler
  const handleMove = useCallback(async (id: string, to: Status) => {
    try {
      await updateTask(id, { status: to });
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  }, [updateTask]);

  // Memoize phase configurations
  const phaseConfigs = useMemo(() => 
    PHASES.map(cfg => ({
      ...cfg,
      cards: cardsByStatus[cfg.key] || []
    })),
    [cardsByStatus]
  );

  if (loading) {
    return <div className="board-container">Loading tasks...</div>;
  }

  if (error) {
    return <div className="board-container">Error: {error}</div>;
  }

  return (
    <>
      <div className='board-container'>
        <div className="board-header">
          <div className='board-header-left'>
            <img src={tabler_icon2} alt="" />
            <div className="cu-all-inner">
              <span>All</span> 
              <span className="cu-dot"></span> 
              <span>{taskCount}</span>
            </div>
            <img src={right_icon} alt="" />
          </div>

          <div className="board-header-right">
            <span>Filter</span>
            <span>Sort</span>
            <span>Options</span>
          </div>
        </div>

        <div>
          <div className="board-scroll">
            <div
              className="board"
              style={{ '--phases': PHASES.length } as React.CSSProperties}
            >
              {phaseConfigs.map(cfg => (
                <Phase
                  key={cfg.key}
                  title={cfg.title}
                  color={cfg.badgeColor}
                  cards={cfg.cards}
                  allStatuses={ALL_STATUSES}
                  onAdd={() => handleOpenModal(cfg.key)}
                  onMove={handleMove}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <TaskModalWithSuspense 
        open={isModalOpen}
        onClose={handleCloseModal}
        status={modalStatus}
      />
    </>
  );
};

export default Board;