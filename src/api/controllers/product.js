const { deleteFile } = require('../../utils/deleteFile');
const { genericUpdate } = require('../../utils/genericUpdate');
const { getInfo } = require('../../utils/getInfo');
const { getPaginationInfo } = require('../../utils/getPaginationInfo');
const { dataPerPage } = require('../../utils/variables/dataPerPage');
const Product = require('../models/product');

const getProducts = async (req, res, next) => {
  try {
    let { page = 1 } = req.query;
    page = parseInt(page);

    const { total, lastPage } = await getPaginationInfo(Product);

    if (page > lastPage) {
      return res.status(400).json({
        info: getInfo(total, page, lastPage, 'products'),
        projects: null
      });
    }

    const products = await Product.find()
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name lastName'
        }
      })
      .skip((page > lastPage ? lastPage - 1 : page - 1) * dataPerPage)
      .limit(dataPerPage);

    return res.status(200).json({
      info: getInfo(total, page, lastPage, 'products'),
      products
    });
  } catch (error) {
    return res.status(400).json('Error al recuperar todos los productos');
  }
};

const filterProducts = async (req, res, next) => {
  try {
    console.log('Query recibida:', req.query);
    const filters = {};

    if (req.query.nameProduct) {
      filters.$text = { $search: req.query.nameProduct };
    }

    if (req.query.typeProduct) {
      filters.typeProduct = req.query.typeProduct;
    }

    if (req.query.price) {
      filters.price = { $lte: Number(req.query.price) };
    }

    const products = await Product.find(filters).populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name lastName'
      }
    });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json('Error al filtrar los productos');
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name lastName'
      }
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json('error');
  }
};

const createProduct = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    newProduct.user = req.user._id;

    if (req.file) {
      newProduct.productImage = req.file.path;
    }

    const product = await newProduct.save();
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json('Error al crear el nuevo producto');
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updated = await genericUpdate({
      id: req.params.id,
      user: req.user,
      body: req.body,
      Model: Product,
      file: req.file
    });

    return res.status(200).json({
      message: 'El producto se ha actualizado correctamente',
      updated
    });
  } catch (error) {
    if (error.message === 'Imagen no encontrada') {
      return res.status(404).json('Imagen no encontrada');
    } else if (error.message === 'Evento no encontrado') {
      return res.statu(404).json('Producto no encontrado');
    }
    return res
      .status(400)
      .json({ message: `Error en la actualización del producto` });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productDeleted = await Product.findByIdAndDelete(id);

    if (productDeleted) {
      deleteFile(productDeleted.productImage);
      return res
        .status(200)
        .json({ message: 'Producto eliminado', productDeleted });
    } else {
      return res.status(404).json('Producto no encontrado');
    }
  } catch (error) {
    return res.status(400).json({ message: 'Error al eliminar el producto' });
  }
};

module.exports = {
  getProducts,
  filterProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
