const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use(userRoutes);
router.use(cardRoutes);

router.use('/*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

module.exports = router;
