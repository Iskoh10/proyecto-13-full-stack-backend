const { isAuth, isAdmin } = require('../../middlewares/auth');
const { checkUser } = require('../../middlewares/checkUser');
const upload = require('../../middlewares/file');
const {
  filterBlogs,
  getBlogById,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blog');

const blogRouter = require('express').Router();

blogRouter.get('/filter/:summary', [isAuth], filterBlogs);
blogRouter.get('/:id', [isAuth, isAdmin], getBlogById);
blogRouter.get('/', getBlogs);
blogRouter.post(
  '/',
  [isAuth, isAdmin],
  upload.fields([{ name: 'image', maxCount: 5 }]),
  createBlog
);
blogRouter.put(
  '/:id',
  [isAuth],
  upload.fields([{ name: 'image', maxCount: 5 }]),
  updateBlog
);
blogRouter.delete('/:id', [isAuth, isAdmin], deleteBlog);

module.exports = blogRouter;
