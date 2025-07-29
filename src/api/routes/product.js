const { isAuth, isAdmin } = require('../../middlewares/auth');
const { checkUser } = require('../../middlewares/checkUser');
const upload = require('../../middlewares/file');
const {
  getProducts,
  filterProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct
} = require('../controllers/product');

const productRouter = require('express').Router();

productRouter.get('/filter', filterProducts);
productRouter.get('/:id', [isAuth, isAdmin], getProductById);
productRouter.get('/', getProducts);
productRouter.post(
  '/',
  [isAdmin],
  upload.single('productImage'),
  createProduct
);
productRouter.put(
  '/:id',
  [isAuth],
  upload.single('productImage'),
  updateProduct
);
productRouter.delete(
  '/:id',
  [isAuth, checkUser('deleteProduct')],
  deleteProduct
);

module.exports = productRouter;
