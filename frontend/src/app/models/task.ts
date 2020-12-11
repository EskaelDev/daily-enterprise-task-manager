export class Task {
    id: number = -1;
    title: string;
    description: string;
    tags: string[];
    userId: number;

    constructor(init?:Partial<Task>) {
        Object.assign(this, init);
    }
}
