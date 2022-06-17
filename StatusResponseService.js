module.exports = StatusResponseService

class StatusResponseService{

    constructor() {
    }

    succesReponse(value: boolean, message: string) {
        return JSON.stringify({value, message});
    }
}

