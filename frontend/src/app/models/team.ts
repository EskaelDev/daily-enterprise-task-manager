import { User } from './user';

export class Team {
    id: number;
    name: string;
    manager: User;
    members: User[];
}
