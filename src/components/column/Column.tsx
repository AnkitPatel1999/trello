import { Status } from '../../domain/status';
import type { Card } from '../../domain/types';

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
    <section>
      <header style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, background: color, borderRadius: 9999 }} />
        <h3 style={{ margin: 0 }}>{title} <small> {cards.length}</small></h3>
        <button style={{ marginLeft: 'auto' }} onClick={() => {
          const t = prompt('New card title?');
          if (t && t.trim()) onAdd(t.trim());
        }}>+ New</button>
      </header>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cards.map(card => (
          <li key={card.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{card.title}</div>
            {card.description ? <div style={{ color: '#6b7280', marginTop: 4 }}>{card.description}</div> : null}
            <div style={{ marginTop: 8 }}>
              <label style={{ fontSize: 12, color: '#6b7280', marginRight: 6 }}>Move to</label>
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


