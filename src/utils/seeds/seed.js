require('dotenv').config();
const mongoose = require('mongoose');
const { hashPassword } = require('../hashPassword');
const User = require('../../api/models/user');
const Product = require('../../api/models/product');
const Order = require('../../api/models/order');
const users = require('../../utils/seeds/users');
const Comment = require('../../api/models/comment');
const Workshop = require('../../api/models/workshop');
const Blog = require('../../api/models/blog');
const products = require('./products');
const orders = require('./orders');
const calculateOrderItems = require('../calculateOrderItems');

const launchSeed = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Conectamos con la BBDD');

    await User.collection.drop();
    await Product.collection.drop();
    await Order.collection.drop();
    await Blog.collection.drop();
    await Comment.collection.drop();
    await Workshop.collection.drop();
    console.log('Eliminación de colecciones previas OK');

    const usersHashed = users.map((user) => ({
      ...user,
      password: hashPassword(user.password)
    }));

    await User.insertMany(usersHashed);
    console.log('usuarios agregados correctamente');

    await Product.insertMany(products);
    console.log('productos agregados correctamente');

    const processedOrders = [];
    for (const order of orders) {
      const { items, totalPrice } = await calculateOrderItems(order.items);
      processedOrders.push({ ...order, items, totalPrice });
    }

    await Order.insertMany(processedOrders);
    console.log('pedidos agregados correctamente');

    await mongoose.disconnect();
    console.log('Desconectamos de la BBDD');
  } catch (error) {
    console.log('Hubo un error en el lanzamiento de la semilla', error);
  }
};

launchSeed();
