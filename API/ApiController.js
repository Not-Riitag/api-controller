const fs = require ('fs')
const path = require ('path')

class ApiController {
    registeredApiVersions = {}

    registerVersion (version) {
        this.registeredApiVersions[version] = {
            get: {},
            post: {},
            put: {},
            patch: {}
        }

        this.registerApiRoutes(version)

        console.log(`Registered ${version}`)
    }

    registerApiRoutes (version) {
        fs.readdirSync(path.resolve('versions', version)).forEach(file => {
            if (!file.endsWith('.js')) return

            const api = require(path.resolve('versions', version, file))
            this.registerRoute(version, api)
        })

        console.log(`${version} registered with routes:`)
        console.log(this.registeredApiVersions)
    }

    registerRoute (version, api) {
        if (api.get) this.registeredApiVersions[version].get[api.route] = api.get
        if (api.post) this.registeredApiVersions[version].post[api.route] = api.post
        if (api.put) this.registeredApiVersions[version].put[api.route] = api.put
        if (api.patch) this.registeredApiVersions[version].patch[api.route] = api.patch
    }
}

module.exports = ApiController
