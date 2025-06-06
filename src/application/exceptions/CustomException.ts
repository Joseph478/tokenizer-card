interface CustomExceptionInterface {
    code: string;
    message: any;
    httpStatus: number;
    details?: Array<string> | string | undefined;
}

export default class CustomException extends Error {
    public code: string;
    public details?: string[] | string;
    public httpStatus: number;

    constructor(error: CustomExceptionInterface) {
        super(error.message);
        this.name = 'CustomException';
        this.code = error.code;
        this.details = error.details;
        this.httpStatus = this.getHttpStatus(error.httpStatus);
    }

    private getHttpStatus(httpStatus?: number) {
        return httpStatus ?? 500;
    }
}

