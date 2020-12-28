export class Task {
    id?: number;
    title: string;
    description: any;
    tags: string[] = [];
    userLogin?: string;
    teamName: string;
    taskLanguage: string;
    taskStatus: Status = Status.ToDo;
    taskDuration: number;

    constructor(init?:Partial<Task>) {
        Object.assign(this, init);
    }
}

export enum Status {
    ToDo,
    InProgress,
    Done
}