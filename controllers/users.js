const User = require("../models/user");
const ERROR = require("../constants/constants");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res.status(ERROR.DEFAULT_ERROR).send({ message: "Произошла ошибка" })
    );
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError")
        return res
          .status(ERROR.NOT_FOUND)
          .send({ message: "Запрашиваемый пользователь не найден" });
      res.status(ERROR.DEFAULT_ERROR).send({ message: "Произошла ошибка" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(ERROR.BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      res.status(ERROR.DEFAULT_ERROR).send({ message: "Произошла ошибка" });
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
    }
  )
    .then((newData) => res.send({ data: newData }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(ERROR.BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      res.status(ERROR.DEFAULT_ERROR).send({ message: "Произошла ошибка" });
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
    }
  )
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch(() =>
      res.status(ERROR.DEFAULT_ERROR).send({ message: "Произошла ошибка" })
    );
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
};
