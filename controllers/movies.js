const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const IncorrectUser = require('../errors/incorrect-user');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const deleteMovies = (req, res, next) => {
  console.log(req.params);
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Карточка с указанным фильмом не найдена.'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        next(new IncorrectUser('Нельзя удалять чужие фильмы'));
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => res.send(movie))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректный _id фильма при удалении карточки.'));
      }
      return next(err);
    });
};

const createMovies = (req, res, next) => {
  Movie.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  deleteMovies,
  createMovies,
};
