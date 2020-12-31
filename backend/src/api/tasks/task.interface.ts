import { Language } from "../../enums/languages.enum";

export default interface Task {
    id?: string;
    title: string;
    description: string;
    tags: string[];
    userLogin?: string;
    teamName: string;
    taskLanguage: Language;
    taskStatus: Status;
    taskDuration: number;

}

export enum Status {
    InProgress,
    ToDo,
    Done
}