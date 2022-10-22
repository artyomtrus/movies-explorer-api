const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictEmailError = require('../errors/conflict-email-error');

const getUserByMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Не корректно введен _id пользователя'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then((user) => res.send(user.toObject()))
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictEmailError('Пользователь с таким email уже создан'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Переданы некорректные данные'));
        }
        return next(err);
      }));
};

const refreshUser = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(req.user._id, { name }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserByMe,
  createUser,
  refreshUser,
  login,
};
