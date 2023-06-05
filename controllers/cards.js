const Card = require("../models/card");

// const getUsers = (req, res) => {
//   Users.find({})
//     .then((users) => res.send({ data: users }))
//     .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
// };

// const getUser = (req, res) => {

// }

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const deleteCard = (req, res) => {
  const { name, about } = req.body
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId, {name, about})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard
};
