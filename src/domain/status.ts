export const Status = {
  Proposed: 'proposed',
  Todo: 'todo',
  InProgress: 'inprogress',
  Done: 'done',
  Deployed: 'deployed',
} as const;

export type Status = typeof Status[keyof typeof Status];

export const ALL_STATUSES: Status[] = [
  Status.Proposed,
  Status.Todo,
  Status.InProgress,
  Status.Done,
  Status.Deployed,
];


