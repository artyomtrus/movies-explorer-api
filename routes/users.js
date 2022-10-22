const router = require('express').Router();
const {
  getUserByMe,
  refreshUser,
} = require('../controllers/users');
const { validateRefreshUser } = require('../middlewares/validations');

router.get('/me', getUserByMe);
router.patch('/me', validateRefreshUser, refreshUser);

module.exports = router;
