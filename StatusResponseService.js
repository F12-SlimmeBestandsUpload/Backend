module.exports = StatusResponseService

class StatusResponseService{

    constructor() {
    }

    response(statusCode: int, value: boolean, message: string) {
        return JSON.stringify({value, message});
    }

    succesResponse(message: string) {
        this.response(200, true, message);
    }

    internalServerErrorResponse() {
        this.response(500, false, "500 Internal Server Error")
    }
}