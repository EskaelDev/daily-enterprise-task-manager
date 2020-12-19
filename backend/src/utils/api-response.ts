export default interface ApiResponse {
    successful: boolean;
    body: any;
    caller: {
        class: string;
        method: string;
    }
}