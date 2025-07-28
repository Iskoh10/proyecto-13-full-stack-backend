const Product = require('../api/models/product');

const checkUser = (action = '') => {
  return async (req, res, next) => {
    try {
      let ownerId;

      if (action === 'deleteProduct') {
        const product = await Product.findById(req.params.id);
        if (!product) {
          return res.status(400).json({ message: 'Producto no encontrado' });
        }
        ownerId = product.user.toString();
      } else {
        ownerId = req.params.id;
      }

      if (req.user.role === 'admin' || req.user._id.toString() === ownerId) {
        return next();
      }
      return res
        .status(403)
        .json({ message: 'No tienes permisos para esta accióm' });
    } catch (error) {
      console.error('❌ Error en checkUser:', error);
      return res
        .status(500)
        .json({ message: 'Error en verificación de permisos' });
    }
  };
};

module.exports = { checkUser };
