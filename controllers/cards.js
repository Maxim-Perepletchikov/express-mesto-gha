const Card = require("../models/card");
const ERROR = require("../constants/constants");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(ERROR.BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      res.status(ERROR.DEFAULT_ERROR).send({ message: "Произошла ошибка" });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError")
        return res
          .status(ERROR.NOT_FOUND)
          .send({ message: "Запрашиваемая карточка не найдена" });
      res.status(ERROR.DEFAULT_ERROR).send({ message: "Произошла ошибка" });
    });
};

const addLike = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch(() =>
      res.status(ERROR.DEFAULT_ERROR).send({ message: "Произошла ошибка" })
    );
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch(() =>
      res.status(ERROR.DEFAULT_ERROR).send({ message: "Произошла ошибка" })
    );
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
