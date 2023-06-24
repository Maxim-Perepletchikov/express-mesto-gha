const errorHandler = (err, req, res, next) => {
  let { message } = err;

  if (err.statusCode === 500) {
    message = 'Ошибка на сервере';
  }

  res.status(err.statusCode).send({ message });
  next();
};

module.exports = { errorHandler };
