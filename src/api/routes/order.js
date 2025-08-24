const { isAuth, isAdmin } = require('../../middlewares/auth');
const { checkUser } = require('../../middlewares/checkUser');
const {
  filterOrders,
  getOrderById,
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser
} = require('../controllers/order');

const orderRouter = require('express').Router();

orderRouter.get('/filter/:status', [isAuth, isAdmin], filterOrders);
orderRouter.get('/my-orders', [isAuth], getOrdersByUser);
orderRouter.get('/:id', [isAuth], getOrderById);
orderRouter.get('/', [isAuth, isAdmin], getOrders);
orderRouter.post('/', [isAuth], createOrder);
orderRouter.put('/:id', [isAuth, checkUser()], updateOrder);
orderRouter.delete('/:id', [isAuth, isAdmin], deleteOrder);

module.exports = orderRouter;
