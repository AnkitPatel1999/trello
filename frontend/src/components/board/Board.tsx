// frontend/src/components/board/Board.tsx
import { useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import Phase from '../phase/Phase';
import { PHASES } from '../../domain/phases';
import { Status, ALL_STATUSES } from '../../domain/status';
import type { Card } from '../../domain/types';
import { useTasks } from '../../hooks/useTasks';
import { useTasksData } from '../../hooks/useTasksData';
import type { RootState } from '../../store';
import './board.css';

import tabler_icon2 from "../../assets/icons/tabler_icon2.svg"
import right_icon from "../../assets/icons/right_icon.svg"

const Board = () => {
  const activeProjectId = useSelector((state: RootState) => state.projects.activeProjectId);
  
  const { loading, error } = useTasksData();
  const { tasks, updateTask } = useTasks();

  // ✅ Memoize ALL_STATUSES to prevent recreation
  const allStatusesRef = useRef(ALL_STATUSES as Status[]);

  // Memoize filtered cards
  const cards = useMemo(() => 
    tasks.filter(task => task.projectId === activeProjectId),
    [tasks, activeProjectId]
  );

  // Memoize task count
  const taskCount = useMemo(() => cards.length, [cards]);

  // ✅ Memoize cards grouped by status with stable references
  const cardsByStatus = useMemo(() => {
    const grouped: Record<Status, Card[]> = {} as Record<Status, Card[]>;
    
    PHASES.forEach(phase => {
      const phaseCards = cards.filter(card => card.status === phase.key);
      grouped[phase.key] = phaseCards;
    });
    
    return grouped;
  }, [cards]);

  // ✅ Stable handleMove function
  const handleMove = useCallback(async (id: string, to: Status) => {
    try {
      await updateTask(id, { status: to });
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  }, [updateTask]);

  // ✅ Memoize phase configurations with stable array references
  const phaseConfigs = useMemo(() => 
    PHASES.map(cfg => ({
      key: cfg.key,
      title: cfg.title,
      badgeColor: cfg.badgeColor,
      fontColor: cfg.fontColor, // Add this line
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
                fontColor={cfg.fontColor} // Add this line
                cards={cfg.cards}
                allStatuses={allStatusesRef.current}
                status={cfg.key}
                onMove={handleMove}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;