module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = this.errors;
    }
    
    static UnauthorizedError() {
        return new ApiError(401, 'User is not autorized')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }
}