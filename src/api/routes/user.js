const { isAuth, isAdmin } = require('../../middlewares/auth');
const { checkUser } = require('../../middlewares/checkUser');
const {
  register,
  getUsers,
  getUser,
  login,
  updateUser,
  deleteUser,
  filterByUsername
} = require('../controllers/user');

const userRouter = require('express').Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.put('/:id', [isAuth, checkUser()], updateUser);
userRouter.delete('/:id', [isAuth, checkUser()], deleteUser);
userRouter.get('/by-name/:name', [isAuth, isAdmin], filterByUsername);
userRouter.get('/:id', [isAuth, isAdmin], getUser);
userRouter.get('/', [isAuth, isAdmin], getUsers);

module.exports = userRouter;
