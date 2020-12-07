import { IUser } from './iuser';

export class User implements IUser {
    id: number = -1;
    login: string;
    password: string;
}
