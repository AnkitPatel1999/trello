// frontend/src/components/board/Board.tsx
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Phase from '../phase/Phase';
import { PHASES } from '../../domain/phases';
import { Status, ALL_STATUSES } from '../../domain/status';
import type { Card } from '../../domain/types';
import { useTasks } from '../../hooks/useTasks';
import { useTasksData } from '../../hooks/useTasksData'; // ✅ New import
import type { RootState } from '../../store';
import './board.css';

import tabler_icon2 from "../../assets/icons/tabler_icon2.svg"
import right_icon from "../../assets/icons/right_icon.svg"

const Board = () => {
  const activeProjectId = useSelector((state: RootState) => state.projects.activeProjectId);
  
  // ✅ Fetch data once at this level
  const { loading, error } = useTasksData();
  
  // ✅ Get tasks and operations (no fetching here)
  const { tasks, updateTask } = useTasks();

  // Memoize filtered cards
  const cards = useMemo(() => 
    tasks.filter(task => task.projectId === activeProjectId),
    [tasks, activeProjectId]
  );

  // Memoize task count
  const taskCount = useMemo(() => cards.length, [cards]);

  // Memoize cards grouped by status
  const cardsByStatus = useMemo(() => {
    const grouped: Record<Status, Card[]> = {} as Record<Status, Card[]>;
    PHASES.forEach(phase => {
      grouped[phase.key] = cards.filter(card => card.status === phase.key);
    });
    return grouped;
  }, [cards]);

  // Memoize move handler
  const handleMove = useCallback(async (id: string, to: Status) => {
    try {
      await updateTask(id, { status: to });
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  }, [updateTask]);

  // Simplified phase configurations
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
                allStatuses={ALL_STATUSES as Status[]}
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