import { Language } from './language.enum';
import { Role } from './role.enum';

export interface IUser {
    login: string;
    password?: string;
    userRole: Role;
    userName: string;
    surname: string;
    userLanguage: Language;
    token?: string;
}
