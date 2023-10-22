const jwt = require('jsonwebtoken');

const { SECRET_KEY = 'movies-key' } = process.env;
const UnauthorizedError = require('../errors/UnauthorisedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация пользователя.');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация пользователя.');
  }

  req.user = payload;
  next();
};
