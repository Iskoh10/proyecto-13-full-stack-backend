const Product = require('../api/models/product');

const calculateOrderItems = async (items, baseMap = new Map()) => {
  const itemMap = new Map(baseMap);

  for (const newItem of items) {
    const product = await Product.findById(newItem.productId);

    if (!product) {
      throw new Error(`Producto no encontrado: ${newItem.productId}`);
    }

    const productId = product._id.toString();
    const quantity = newItem.quantity;

    itemMap.set(productId, quantity);
  }

  let totalPrice = 0;
  const totalItems = [];

  for (const [productId, quantity] of itemMap.entries()) {
    const product = await Product.findById(productId);
    if (product) {
      totalItems.push({ product: product._id, quantity });
      totalPrice += product.price * quantity;
    }
  }
  return { items: totalItems, totalPrice };
};

module.exports = calculateOrderItems;
