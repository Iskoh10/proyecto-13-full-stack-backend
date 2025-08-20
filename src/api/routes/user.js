const { isAuth, isAdmin } = require('../../middlewares/auth');
const { checkUser } = require('../../middlewares/checkUser');
const {
  register,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  filterByUsername
} = require('../controllers/user');

const userRouter = require('express').Router();

userRouter.post('/register', register);
userRouter.delete('/deleteUser', [isAuth], deleteUser);
userRouter.put('/:id', [isAuth, checkUser()], updateUser);
userRouter.get('/by-name/:name', [isAuth, isAdmin], filterByUsername);
userRouter.get('/:id', [isAuth, isAdmin], getUser);
userRouter.get('/', [isAuth, isAdmin], getUsers);

module.exports = userRouter;
