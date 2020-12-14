export class Task {
    id?: number;
    title: string;
    description: string;
    tags: string[] = [];
    userLogin?: string;
    teamName: string;
    language: string;
    status: Status = Status.ToDo;
    duration: number;

    constructor(init?:Partial<Task>) {
        Object.assign(this, init);
    }
}

export enum Status {
    InProgress,
    ToDo,
    Done
}