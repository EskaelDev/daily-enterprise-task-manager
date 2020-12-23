import { User } from "./user";

export class Team {
    teamName: string;
    department: string;
    manager: User;
    members: User[];

    constructor(init?:Partial<Team>) {
        Object.assign(this, init);
    }
}
