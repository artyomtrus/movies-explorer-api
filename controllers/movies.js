const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const IncorrectUser = require('../errors/incorrect-user');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

const deleteMovies = (req, res, next) => {
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
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
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

// const putLike = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(new NotFoundError('Передан несуществующий _id карточки.'))
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(new BadRequestError('Переданы некорректные данные при постановке лайка.'));
//       }
//       return next(err);
//     });
// };
//
// const deleteLike = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(new NotFoundError('Передан несуществующий _id карточки.'))
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(new BadRequestError('Переданы некорректные данные при снятии лайка'));
//       }
//       return next(err);
//     });
// };

module.exports = {
  getMovies,
  deleteMovies,
  createMovies,
};
