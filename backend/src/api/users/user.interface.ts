import { Language } from "../../enums/languages.enum";


export default interface User {
    login: string;
    password: string;
    userRole?: Role;
    userName?: string;
    surname?: string;
    userLanguage: Language;
}
export enum Role {
    Admin,
    Manager,
    Worker
}
