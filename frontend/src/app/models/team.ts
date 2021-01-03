import { User } from "./user";

export class Team {
    teamName: string;
    department: string;
    manager: string;
    Manager: User;
    members: string[] = [];
    Members: User[] = [];

    static prepareToUpdate(team: Team) {
        return new Team({teamName: team.teamName, department: team.department, manager: team.manager, members: team.members});
    }

    constructor(init?:Partial<Team>) {
        Object.assign(this, init);
    }
}
