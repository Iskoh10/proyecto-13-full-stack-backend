const authRouter = require('./auth');
const blogRouter = require('./blog');
const commentRouter = require('./comment');
const orderRouter = require('./order');
const productRouter = require('./product');
const userRouter = require('./user');
const workshopRouter = require('./workshop');

const mainRouter = require('express').Router();
mainRouter.use('/users', userRouter);
mainRouter.use('/auth', authRouter);
mainRouter.use('/products', productRouter);
mainRouter.use('/orders', orderRouter);
mainRouter.use('/blogs', blogRouter);
mainRouter.use('/comments', commentRouter);
mainRouter.use('/workshops', workshopRouter);

module.exports = mainRouter;
