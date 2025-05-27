import { User } from './user.model';
import { Message } from './message.model';

export interface Chat {
  id: number;
  participants: User[];
  messages: Message[];
  lastUpdated: Date;
}
