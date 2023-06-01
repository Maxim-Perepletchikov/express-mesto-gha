const Users = require('../models/user')

module.exports.getUsers =
  (req, res) => {
    Users.find({})
      .then(users => res.send({data: users}))
      .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
  }