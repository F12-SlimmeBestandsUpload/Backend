module.exports = StatusResponseService

class StatusResponseService{

    constructor() {
    }

    response(statusCode, value, message) {
        return JSON.stringify({statusCode, value, message});
    }

    succesResponse(message) {
        this.response(200, true, message);
    }

    badRequestResponse() {
        this.response(400, false, "400 Bad Request")
    }

    unauthorizedResponse() {
        this.response(401, false, "401 Unauthorized")
    }

    ForbiddenResponse() {
        this.response(403, false, "403 Forbidden")
    }

    notFoundErrorResponse() {
        this.response(404, false, "404 Not Found")
    }

    notAcceptableResponse() {
        this.response(406, false, "406 Bad Content Type/Parameters are missing")
    }

    internalServerErrorResponse() {
        this.response(500, false, "500 Internal Server Error")
    }
}