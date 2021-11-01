const ApiRoute = require("../../API/ApiRoute")
const Errors = require("../../API/Errors")
const { SessionManager, UserManager } = require('../../data-controller/index')
const { ConflictError } = require('rest-api-errors')
const PasswordUtils = require("../../data-controller/src/PasswordUtils")
const EnumPermissions = require("../../data-controller/src/Enum/EnumPermissions")

module.exports = new ApiRoute({
    route: 'users/:user',

    get: async (req, res) => {
        var user = null

        switch (req.params.user) {
            case '@me':
                const session = await SessionManager.ParseAuthorization(req.headers.authorization)
                if (!session) return res.status(Errors.UnauthorizedError.status).json(Errors.UnauthorizedError)
                user = await UserManager.get({ id: session.user }, { password: 0, "_id": 0 })
                break

            default:
                if (!user) user = await UserManager.get({ id: req.params.user }, {username: 1, id: 1, permissions: 1})
                break
        }

        return user == null ? res.status(404).json({error: 'User not found'}) : res.json(Object.assign(user, { permissions: user.permissions.permissions }))

    },

    patch: async (req, res) => {
        const session = await SessionManager.ParseAuthorization(req.headers.authorization)
        if (!session) return res.status(Errors.UnauthorizedError.status).json(Errors.UnauthorizedError)
        
        const user = await UserManager.get({ id: session.user }, { password: 0 })

        if (req.params.user == '@me') req.params.user = user.id // Replace the paramater with the current user.

        const updateUser = await UserManager.get({ id: req.params.user }, { password: 0 })

        // Do not allow the user to edit other users without permission
        if ((!user.permissions.has(EnumPermissions.EDIT_USERS) && updateUser.id != user.id)) return res.status(Errors.ForbiddenError.status).json(Errors.ForbiddenError)

        if (req.body.password) {
            req.body.password = PasswordUtils.makePassword(req.body.password, user.username) // Rehash and and apply the password.
            SessionManager.remove(user) // Remove the current session.
        }

        if (req.body.username || req.body.email) // Confirm the new username or email is not already in use.
            if (await UserManager.get({ $or: [{ $text: { $search: req.body.username, $caseSensitive: false } }, { email: req.body.email }] }, { id: 1 })) 
                return res.status(new ConflictError().status).json({ error: 'Username or email already in use' })
    
        // Verify if the user is allowed to change the data
        if (req.body.permissions)
            // If the permissions don't match, error.
            if (!user.permissions.has(EnumPermissions.EDIT_USER_PERMISSIONS) || !(user.permissions.has(req.body.permissions))) return res.status(Errors.ForbiddenError.status).json(Errors.ForbiddenError)

        updateUser.update(req.body)
        res.json({ user: session.user, set: !req.body.password ? req.body : Object.assign({}, req.body, { password: '<redacted>' }) }) // Return the edited fields but redact any password.
    }
})
