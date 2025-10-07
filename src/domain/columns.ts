import { Status } from './status';

export type ColumnConfig = {
  key: Status;
  title: string;
  badgeColor: string;
};

export const COLUMNS: ColumnConfig[] = [
  { key: Status.Proposed, title: 'Proposed', badgeColor: 'var(--purple-500, #8b5cf6)' },
  { key: Status.Todo, title: 'Todo', badgeColor: 'var(--blue-500, #3b82f6)' },
  { key: Status.InProgress, title: 'In Progress', badgeColor: 'var(--cyan-500, #06b6d4)' },
  { key: Status.Done, title: 'Done', badgeColor: 'var(--green-500, #22c55e)' },
  { key: Status.Done, title: 'Done', badgeColor: 'var(--green-500, #22c55e)' },
  { key: Status.Done, title: 'Done', badgeColor: 'var(--green-500, #22c55e)' },
  { key: Status.Deployed, title: 'Deployed', badgeColor: 'var(--zinc-400, #a1a1aa)' },
];


