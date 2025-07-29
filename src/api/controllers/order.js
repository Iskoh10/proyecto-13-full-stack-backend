const calculateOrderItems = require('../../utils/calculateOrderItems');
const Order = require('../models/order');

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name')
      .populate('items.product', 'nameProduct');
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(400).json('Eeror al recuperar todos los pedidos');
  }
};

const filterOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $text: { $search: req.params.status }
    });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(400).json('Error al filtrar los pedidos');
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('customer', 'name')
      .populate('items.product', 'nameProduct');
    return res.status(200).json(order);
  } catch (error) {
    return res.status(400).json('Error al recuperar el pedido', id);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryDate } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: 'El pedido debe incluir productos.' });
    }

    const { items: validatedItems, totalPrice } = await calculateOrderItems(
      items
    );

    const newOrder = new Order({
      customer: req.user._id,
      items: validatedItems,
      totalPrice,
      deliveryDate
    });

    const order = await newOrder.save();

    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json('Error al crear el pedido');
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const oldOrder = await Order.findById(id);
    if (!oldOrder) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    const baseMap = new Map();
    for (const item of oldOrder.items) {
      baseMap.set(item.product.toString(), item.quantity);
    }

    let newItems = [];

    if (req.body.items && Array.isArray(req.body.items)) {
      newItems = req.body.items;
    }

    const { items: totalItems, totalPrice } = await calculateOrderItems(
      newItems,
      baseMap
    );

    oldOrder.items = totalItems;
    oldOrder.totalPrice = totalPrice;

    if (req.body.deliveryDate) oldOrder.deliveryDate = req.body.deliveryDate;
    if (req.body.status) oldOrder.status = req.body.status;

    const updatedOrder = await oldOrder.save();

    return res
      .status(200)
      .json({ message: 'Pedido actualizado correctamente', updatedOrder });
  } catch (error) {
    if (error.message.includes('Producto no encontrado')) {
      return res.status(404).json({ message: error.message });
    }

    return res
      .status(400)
      .json({ message: 'Error en la actualización del pedido' });
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderDeleted = await Order.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Pedido eliminado:', orderDeleted });
  } catch (error) {
    return res.status(400).json({ message: 'Error al eliminar el pedido' });
  }
};

module.exports = {
  getOrders,
  filterOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
