const express = require ('express')
const {UserManager, SessionManager} = require('./data-controller/index')
const app = express()
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const { UnauthorizedError, ConflictError } = require('rest-api-errors')
const Errors = require('./API/Errors')

const ApiController = new (require('./API/ApiController'))
const supportedVersions = {
    v1: 'v1'
}

const currentVersion = supportedVersions.v1

// Rewrite URLS to current API version
app.use((req, res, next) => {
    if (req.url[1] != 'v') req.url = `/${currentVersion}${req.url}`
    next()
})

app.use(express.json())
app.use(passport.initialize())

passport.use(new localStrategy((username, password, done) => {
    UserManager.getUserLogin(username, password).then((session) => {
        if (!session) return done(null, false)
        
        return done(null, session)
    })
}))

ApiController.registerVersion(supportedVersions.v1)

Object.entries(ApiController.registeredApiVersions).forEach((version) => {
    Object.entries(version[1].get).forEach((route) => {
        app.get(`/${version[0]}/${route[0]}`, route[1])
        console.log(`Registered get: ${version[0]}/${route[0]}`)
    })

    Object.entries(version[1].post).forEach((route) => {
        app.post(`/${version[0]}/${route[0]}`, route[1])
        console.log(`Registered post: ${version[0]}/${route[0]}`)
    })

    Object.entries(version[1].patch).forEach((route) => {
        app.patch(`/${version[0]}/${route[0]}`, route[1])
        console.log(`Registered patch: ${version[0]}/${route[0]}`)
    })
})

app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    res.json(req.user)
})

app.post('/register', (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.email) return res.status(Errors.BadRequestError.status).json({error: 'Missing username, password or email'})

    UserManager.createUser(req.body).then((user) => { 
        if (user == null) return res.status(new ConflictError().status).json({ error: 'User already exists' })
        res.json(user)
    })
})

app.listen(8091)