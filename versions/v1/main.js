const ApiRoute = require("../../API/ApiRoute");

module.exports = new ApiRoute({
    route: '',
    
    get: (req, res) => {
        res.send({'api_version': '1.0.0'})
    }
})
