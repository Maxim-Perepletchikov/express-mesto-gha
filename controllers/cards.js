const Card = require('../models/card');
const ERROR = require('../constants/constants');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
        return;
      }
      next(err)
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .populate('owner')
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      if (req.user._id !== card.owner.id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      Card.findByIdAndRemove(cardId)
        .then((cardDel) => {
          res.send({ data: cardDel });
        });

      // return res.send({});
    })

    .catch(next);/* (err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR.BAD_REQUEST)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      if (err.message === 'NotFound') {
        return res
          .status(ERROR.NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(ERROR.DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    }); */
};

const addLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
        return;
      }
      next(err);
    })/* (err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      if (err.message === 'NotFound') {
        return res
          .status(ERROR.NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(ERROR.DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    }); */
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
        return;
      }
      next(err)
      // if (err.name === 'CastError') {
      //   return res
      //     .status(ERROR.BAD_REQUEST)
      //     .send({ message: 'Переданы некорректные данные' });
      // }
      // if (err.message === 'NotFound') {
      //   return res
      //     .status(ERROR.NOT_FOUND)
      //     .send({ message: 'Запрашиваемая карточка не найдена' });
      // }
      // return res.status(ERROR.DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
