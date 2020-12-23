import User from "../users/user.interface";

export default interface Team {
    teamName: string;
    department: string;
    manager: User;
    members: User[];

}