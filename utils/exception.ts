export class ScrapeError extends Error {
    code: number
    constructor(message: string, code: number) {
        super(message);
        this.name = new.target.name;
        this.code = code
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}