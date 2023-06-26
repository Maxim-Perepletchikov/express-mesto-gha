const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (error) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};

module.exports = auth;
