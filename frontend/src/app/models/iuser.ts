import { Role } from './role.enum';

export interface IUser {
    login: string;
    password?: string;
    role: Role;
    name: string;
    surname: string;
    language: string;
    token?: string;
}
