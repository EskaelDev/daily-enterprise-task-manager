import { IUser } from './iuser';
import { Language } from './language.enum';
import { Role } from './role.enum';

export class User implements IUser {
    login: string;
    password?: string;
    userRole: Role;
    userName: string;
    surname: string;
    userLanguage: Language;
    token: string;

    constructor(init?:Partial<User>) {
        Object.assign(this, init);
    }
}
