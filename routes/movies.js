const router = require('express').Router();

const {
  getMovies,
  deleteMovies,
  createMovies,
} = require('../controllers/movies');
const { validateCreateMovie, validateMovieId } = require('../middlewares/validations');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovies);
router.delete('/:moviesId', validateMovieId, deleteMovies);

module.exports = router;
