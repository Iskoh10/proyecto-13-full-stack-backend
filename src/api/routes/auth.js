const { isAuth } = require('../../middlewares/auth');
const getProfile = require('../controllers/auth');
const { login, logout } = require('../controllers/user');

const authRouter = require('express').Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/me', isAuth, getProfile);

module.exports = authRouter;
