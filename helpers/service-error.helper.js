export class ServiceErrorException {
    status = 500;
    message = "Something went wrong.";
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}