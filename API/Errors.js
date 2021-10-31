const { UnauthorizedError, BadRequestError, ForbiddenError } = require("rest-api-errors");

module.exports = {
    UnauthorizedError: new UnauthorizedError('invalid_authentication', 'You aren\'t authorized to access this route'),
    BadRequestError: new BadRequestError('bad_request', 'Bad request'),
    ForbiddenError: new ForbiddenError('forbidden', 'You are not allowed to access this route'),
}
