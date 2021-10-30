const { UnauthorizedError } = require("rest-api-errors");

module.exports = {
    UnauthorizedError: new UnauthorizedError('invalid_authentication', 'You aren\'t authorized to access this route')
}
