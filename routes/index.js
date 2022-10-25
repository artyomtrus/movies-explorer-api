const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const NotFoundError = require('../errors/not-found-error');
const { validateCreateUser, validateLogin } = require('../middlewares/validations');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use('/users', auth, routerUsers);
router.use('/movies', auth, routerMovies);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

module.exports = router;
