const express = require ('express')
const {UserManager, SessionManager} = require('./data-controller/index')
const app = express()
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
app.use(express.json())
app.use(passport.initialize())

passport.use(new localStrategy((username, password, done) => {
    UserManager.getUserLogin(username, password).then((session) => {
        if (!session) return done(null, false)
        
        return done(null, session)
    })
}))

app.get('/', (req, res) => {
    res.type('application/json')
    res.send({'api_version': '0.0.1'})
})

app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    res.json(req.user)
})

app.post('/register', (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.email) return res.status(400).json({error: 'Missing username, password or email'})

    UserManager.createUser(req.body).then((user) => { 
        if (user == null) return res.json({ error: 'User already exists' })
        res.json(user)
    })
})

app.get('/users/:user', async (req, res) => {
    if (req.params.user == "me") {
        const session = await SessionManager.getSession(req.headers.authorization)
        if (!session) return res.status(401).json({error: 'Unauthorized'})
        const user = await UserManager.getUser({ id: session.user }, { password: 0 })

        return res.json(Object.assign(user, { permissions: user.permissions.permissions }))
    }
    
    const user = await UserManager.getUser({ id: req.params.user }, {username: 1, id: 1, permissions: 1})
    return user == null ? res.status(404).json({error: 'User not found'}) : res.json(Object.assign(user, { permissions: user.permissions.permissions }))
})

app.listen(8091)