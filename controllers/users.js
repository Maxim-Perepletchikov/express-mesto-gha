const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const ERROR = require('../constants/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(ERROR.DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) throw new Error('NotFound');
      res.send({ data: user });
    })
    .catch((err) => {
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
    });
};

const getCurrentUser = (req, res) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      if (!user) throw new Error('NotFound');
      res.send({ data: user });
    })
    .catch((err) => {
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
    });
};

const createUser = (req, res) => {
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
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(ERROR.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const updateUserInfo = (req, res) => {
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
        return res
          .status(ERROR.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(ERROR.DEFAULT_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
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
    .catch(() => {
      res.status(ERROR.DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
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
