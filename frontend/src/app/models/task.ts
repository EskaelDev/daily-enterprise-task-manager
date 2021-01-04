import { Language } from "./language.enum";
import { User } from "./user";

export class Task {
    id?: number;
    title: string;
    description: any;
    tags: string[] = [];
    userLogin?: string;
    User: User;
    teamName: string;
    taskLanguage: Language;
    taskStatus: Status = Status.ToDo;
    taskDuration: number;
    priority: number;

    constructor(init?:Partial<Task>) {
        Object.assign(this, init);
    }

    static createToUpdate(task: Task) {
        return new Task({id: task.id, title: task.title, description: task.description.translation,
        tags: task.tags, userLogin: task.userLogin, teamName: task.teamName, taskLanguage: task.taskLanguage,
        taskStatus: task.taskStatus, taskDuration: task.taskDuration, priority: task.priority});
    }
}

export enum Status {
    ToDo,
    InProgress,
    Done
}