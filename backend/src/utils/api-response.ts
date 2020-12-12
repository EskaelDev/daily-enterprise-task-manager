export default interface ApiResponse {
    statusCode: number;
    body: any;
    caller: {
        class: string;
        method: string;
    }
}