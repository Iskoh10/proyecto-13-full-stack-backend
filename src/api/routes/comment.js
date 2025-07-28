const { isAuth, isAdmin } = require('../../middlewares/auth');
const { checkUser } = require('../../middlewares/checkUser');
const {
  filterComments,
  getCommentById,
  getComments,
  createComment,
  deleteComment,
  updateComment
} = require('../controllers/comment');

const commentRouter = require('express').Router();

commentRouter.get('/filter/:text', [isAuth, isAdmin], filterComments);
commentRouter.get('/:id', [isAuth, isAdmin], getCommentById);
commentRouter.get('/', [isAuth, isAuth], getComments);
commentRouter.post('/', [isAuth], createComment);
commentRouter.put('/:id', [isAuth, checkUser()], updateComment);
commentRouter.delete('/:id', [isAuth, checkUser()], deleteComment);

module.exports = commentRouter;
