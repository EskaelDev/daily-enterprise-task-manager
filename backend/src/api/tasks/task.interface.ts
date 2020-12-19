export default interface Task {
    id?: string;
    title: string;
    description: string;
    tags: string[];
    userLogin?: string;
    teamName: string;
    taskLanguage: string;
    taskStatus: Status;
    taskDuration: number;

}

export enum Status {
    InProgress,
    ToDo,
    Done
}