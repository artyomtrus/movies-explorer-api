const { celebrate, Joi } = require('celebrate');
const { REGEX } = require('../constants');

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REGEX),
    trailerLink: Joi.string().required().pattern(REGEX),
    thumbnail: Joi.string().required().pattern(REGEX),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

const validateRefreshUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
});

module.exports = {
  validateCreateMovie,
  validateMovieId,
  validateRefreshUser,
};
