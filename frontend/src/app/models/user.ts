import { IUser } from './iuser';
import { Language } from './language.enum';
import { Role } from './role.enum';

export class User implements IUser {
    login: string;
    password?: string;
    role: Role;
    name: string;
    surname: string;
    language: Language;
    token: string;

    constructor(init?:Partial<User>) {
        Object.assign(this, init);
    }
}
