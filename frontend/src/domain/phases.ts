import { Status } from './status';

export type PhaseConfig = {
  key: Status;
  title: string;
  badgeColor: string;
  fontColor: string;
};

export const PHASES: PhaseConfig[] = [
  { key: Status.Proposed, title: 'Proposed', badgeColor: '#FDDBF6' , fontColor: '#702C61'},
  { key: Status.Todo, title: 'Todo', badgeColor: '#E9DFFF' , fontColor: '#483473'},
  { key: Status.InProgress, title: 'In Progress', badgeColor: '#CCF9FF' , fontColor: '#0E6874'},
  { key: Status.Done, title: 'Done', badgeColor: '#D0F8E9' , fontColor: '#166747'},
  { key: Status.Deployed, title: 'Deployed', badgeColor: '#FFF6D7' , fontColor: '#746224'},
];
