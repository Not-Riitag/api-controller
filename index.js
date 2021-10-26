const express = require ('express')
const {UserManager} = require('./data-controller/index')
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.type('application/json')
    res.send({'api_version': '0.0.1'})
})

app.post('/login', (req, res) => {
    res.type('application/json')
    UserManager.getUserLogin(req.body.username, req.body.password).then((user) => {
        console.log(user)
        res.send(user)
    })
})

app.get('/users/:user', (req, res) => {
    res.type('application/json')
    if (req.params.user == "@me") {
        UserManager.getUserByToken(req.headers.authorization).then((user) => {
            res.send(user)
        })
        return;
    }
    
    UserManager.getUser(req.params.user, {username: 1, id: 1}).then((user) => {
        res.send(user)
    })
})

app.listen(8091)