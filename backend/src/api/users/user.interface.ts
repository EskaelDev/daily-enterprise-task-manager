import { Language } from "../../enums/languages.enum";


export default interface User {
    login: string;
    password: string;
    role?: Role;
    name?: string;
    surname?: string;
    language: Language;
}
export enum Role {
    Admin,
    Manager,
    Worker
}
