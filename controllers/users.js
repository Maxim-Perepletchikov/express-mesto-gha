const Users = require("../models/user");

const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const getUser = (req, res) => {
  console.log(req.params);
  Users.findById(req.params.id)
    .then(user => res.send({ user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
}

module.exports = {
  getUsers,
  getUser
};
