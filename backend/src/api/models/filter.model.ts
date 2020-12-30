import { Language } from "../../enums/languages.enum";

export default interface Filter {
    field: string;
    value: string;
    language: Language;
}