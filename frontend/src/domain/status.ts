export const Status = {
  Proposed: 'proposed',
  Todo: 'todo',
  InProgress: 'inprogress',
  Done: 'done',
  Deployed: 'deployed',
} as const;

export type Status = typeof Status[keyof typeof Status];

// Memoize the array to prevent recreation on every import
export const ALL_STATUSES: readonly Status[] = Object.freeze([
  Status.Proposed,
  Status.Todo,
  Status.InProgress,
  Status.Done,
  Status.Deployed,
]);


