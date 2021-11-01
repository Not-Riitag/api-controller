const ApiRoute = require("../../API/ApiRoute");
const Tag = require("../../data-controller/src/Structs/Tag");
const TagManager = require("../../data-controller/src/TagManager");

module.exports = new ApiRoute({
    route: "users/:user/tag",

    get: async (req, res) => {
      const tag = new Tag(await TagManager.get({ user: req.params.user }))
      console.log(req.params.user)
      res.json(tag)
    }
})