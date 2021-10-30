const ApiRoute = require("../../API/ApiRoute")
const Errors = require("../../API/Errors")
const { SessionManager, UserManager } = require('../../data-controller/index')

module.exports = new ApiRoute({
    route: 'users/:user',

    get: async (req, res) => {
        var user = null

        switch (req.params.user) {
            case '@me':
                const session = await SessionManager.getSession(req.headers.authorization)
                if (!session) return res.status(Errors.UnauthorizedError.status).json(Errors.UnauthorizedError)
                user = await UserManager.getUser({ id: session.user }, { password: 0 })
                break

            default:
                if (!user) user = await UserManager.getUser({ id: req.params.user }, {username: 1, id: 1, permissions: 1})
                break
        }

        return user == null ? res.status(404).json({error: 'User not found'}) : res.json(Object.assign(user, { permissions: user.permissions.permissions }))

    }
})
