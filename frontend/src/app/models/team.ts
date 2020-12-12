import { User } from "./user";

export class Team {
    name: string;
    department: string;
    manager: User;
    members: User[];

    constructor(init?:Partial<Team>) {
        Object.assign(this, init);
    }
}
