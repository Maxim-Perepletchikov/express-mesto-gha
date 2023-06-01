const router = require("express").Router();
const { getUsers } = require("../controllers/users");

router.get("/users", getUsers);

module.exports = router;
