const ApiRoute = require("../../API/ApiRoute");
const { UserManager } = require("../../data-controller");
const Tag = require("../../data-controller/src/Structs/Tag");
const TagManager = require("../../data-controller/src/TagManager");

module.exports = new ApiRoute({
    route: "users/:user/tag",

    get: async (req, res) => {
      const tag = new Tag(await TagManager.get(await UserManager.get({ id: req.params.user }, { password: 0, "_id": 0 })))
      console.log(req.params.user)
      res.json(tag)
    }
})