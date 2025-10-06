import { Status } from './status';

export interface Card {
  id: string;
  title: string;
  description?: string;
  status: Status;
}


