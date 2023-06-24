const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
// const ERROR = require('../constants/constants');
const UserNotFound = require('../errors/UserNotFound');
const ValidationError = require('../errors/ValidationError');
const EmailError = require('../errors/EmailError');
const AuthorizationError = require('../errors/AuthorizationError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);/* () => {
      res.status(ERROR.DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    }); */
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) throw new UserNotFound('Пользователь не найден');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        /* return res
          .status(ERROR.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' }); */
        next(new ValidationError('Переданы некорректные данные'));
        return;
      }
      /* if (err.message === 'NotFound') {
        return res
          .status(ERROR.NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res
        .status(ERROR.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' }); */
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      if (!user) throw new UserNotFound('Пользователь не найден');
      res.send({ data: user });
    })
    .catch(next);/* (err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res
          .status(ERROR.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      if (err.message === 'NotFound') {
        return res
          .status(ERROR.NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res
        .status(ERROR.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    }); */
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
        return;
      }
      if (err.code === 11000) {
        next(new EmailError('Пользователь с таким email уже существует'));
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError('Неправильные почта или пароль'));
          }
          const jwt = jsonWebToken.sign(
            { _id: user._id },
            'SECRET',
            // { expiresIn: '7d' },
          );
          res.cookie('jwt', jwt, {
            maxAge: 360000,
            httpOnly: true,
            sameSite: true,
          });
          const { password: _, ...userNoPass } = user.toObject();
          return res.send({ data: userNoPass });
        });
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newData) => res.send({ data: newData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next();
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
  getCurrentUser,
};
