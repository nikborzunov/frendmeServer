const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        const cookiesArray = req.cookies;
        const authorizationHeader = cookiesArray.tokens.accessToken;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }
        const accessToken = cookiesArray.tokens.accessToken;
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());

        }

        req.user = userData;
        next();
        
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};