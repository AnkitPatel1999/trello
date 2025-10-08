import { Status } from './status';

export interface Card {
  id: string;
  title: string;
  description?: string;
  subtitles?: string[];
  status: Status;
}


