import { User } from './user.model';

export interface Message {
  id: number;
  sender: User;
  content: string;
  timestamp: Date;
  chatId: number;
}
