export default interface User {
    login: string;
    password: string;
    role?: string;
    name?:string;
    surname?:string;
    language?:string;
}
