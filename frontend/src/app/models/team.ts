import { User } from "./user";

export class Team {
    teamName: string;
    department: string;
    manager: string;
    Manager: User;
    members: string[];
    Members: User[];

    constructor(init?:Partial<Team>) {
        Object.assign(this, init);
    }
}
