import { IUser } from './iuser';
import { Role } from './role.enum';

export class User implements IUser {
    id: number = -1;
    login: string;
    password: string;
    role?: Role = Role.Worker;
}
