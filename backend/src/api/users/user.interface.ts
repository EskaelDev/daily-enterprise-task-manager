export default interface User {
    login: string;
    password: string;
    role?: Role;
    name?:string;
    surname?:string;
    language?:string;
}
export enum Role {
    Admin,
    Manager,
    Worker
}
