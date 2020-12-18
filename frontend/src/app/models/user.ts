import { IUser } from './iuser';
import { Language } from './language.enum';
import { Role } from './role.enum';

export class User implements IUser {
    login: string;
    password?: string;
    role: Role = Role.Worker;
    name: string;
    surname: string;
    language: Language;
    token: string;

    constructor(init?:Partial<User>) {
        Object.assign(this, init);
    }
}
