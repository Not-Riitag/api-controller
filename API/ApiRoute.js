class ApiRoute {
    /**
     * The linked route
     * @type {String}
     */
    route = undefined

    /**
     * The GET response route
     * @type {Function}
     * @param {String} req
     */
    get = undefined

    /**
     * The POST response route
     * @type {Function}
     */
    post = undefined

    /**
     * The PUT response route
     * @type {Function}
     */
    put = undefined

    /**
     * The PATCH response route
     */
    patch = undefined

    /**
     * 
     * @typedef {Object} ApiRoute
     * @property {String} route The linked route
     * @property {Function} get The GET response route
     * @property {Function} post The POST response route
     * @property {Function} put The PUT response route
     * 
     * @param {ApiRoute} data 
     */
    constructor(data) {
        Object.assign(this, data)
    }
}

module.exports = ApiRoute
