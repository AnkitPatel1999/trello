import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Column from '../column/Column';
import { COLUMNS } from '../../domain/columns';
import { Status, ALL_STATUSES } from '../../domain/status';
import type { Card } from '../../domain/types';
import { addCard, moveCard as moveCardAction, hydrateIfEmpty } from '../../store/cardsSlice';
import type { RootState } from '../../store';
import './board.css';

import tabler_icon2 from "../../assets/icons/tabler_icon2.svg"
import right_icon from "../../assets/icons/right_icon.svg"


const Board = () => {
  const dispatch = useDispatch();
  const cards = useSelector((state: RootState) => state.cards.cards as Card[]);
  const taskCount = 1;

  useEffect(() => {
    dispatch(hydrateIfEmpty());
  }, [dispatch]);

  const handleAdd = (title: string, status: Status, subtitles?: string[]) => {
    dispatch(addCard({ title, status, subtitles }));
  };

  const handleMove = (id: string, to: Status) => {
    dispatch(moveCardAction({ id, to }));
  };

  return (
    <>
      <div className='board-container'>
        
        <div className="board-header">
          <div className='board-header-left'>
            <img src={tabler_icon2} alt="" />
            <div className="cu-all-inner"><span>All</span> <span className="cu-dot"></span> <span>{taskCount}</span></div>
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
              style={{ '--columns': COLUMNS.length } as React.CSSProperties}
            >
              {COLUMNS.map(cfg => (
                <Column
                  key={cfg.key}
                  title={cfg.title}
                  color={cfg.badgeColor}
                  cards={cards.filter((c: Card) => c.status === cfg.key)}
                  allStatuses={ALL_STATUSES}
                  onAdd={(title, subtitles) => handleAdd(title, cfg.key, subtitles)}
                  onMove={handleMove}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Board