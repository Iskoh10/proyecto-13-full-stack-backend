const { deleteFile } = require('../../utils/deleteFile');
const { genericUpdate } = require('../../utils/genericUpdate');
const Blog = require('../models/blog');

const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name lastName'
        }
      })
      .populate({
        path: 'likes',
        select: 'name'
      })
      .populate({
        path: 'dislikes',
        select: 'name'
      })
      .populate({
        path: 'user',
        select: 'name'
      });
    return res.status(200).json(blogs);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error al obtener todos las entradas del blog' });
  }
};

const filterBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({
      $text: { $search: req.params.summary }
    })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name lastName'
        }
      })
      .populate({
        path: 'likes',
        select: 'name'
      })
      .populate({
        path: 'dislikes',
        select: 'name'
      })
      .populate({
        path: 'user',
        select: 'name'
      });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(400).json('Error en el filtrado de blogs');
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name lastName'
        }
      })
      .populate({
        path: 'likes',
        select: 'name'
      })
      .populate({
        path: 'dislikes',
        select: 'name'
      })
      .populate({
        path: 'user',
        select: 'name'
      });
    return res.status(200).json(blog);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error al obtener la entrada del blog' });
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { slug } = req.body;

    const blogrepeated = await Blog.findOne({ slug });

    if (blogrepeated) {
      return res
        .status(400)
        .json({ message: 'Ya existe una entrada con ese título' });
    }

    const newBlog = new Blog(req.body);
    newBlog.user = req.user._id;

    if (req.files && req.files['image']) {
      newBlog.image = req.files['image'].map((file) => file.path);
    }

    const blog = await newBlog.save();
    return res.status(201).json(blog);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error al crear la entrada del blog' });
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const updated = await genericUpdate({
      id: req.params.id,
      user: req.user,
      body: req.body,
      Model: Blog,
      files: req.files
    });

    return res.status(200).json({
      message: 'La entrada del blog se ha actualizado correctamente',
      updated
    });
  } catch (error) {
    if (error.message === 'Imagen no encontrada') {
      return res.status(404).json('Imagen no encontrada');
    } else if (error.message === 'Evento no encontrado') {
      return res.statu(404).json('Entrada de blog no encontrada');
    }
    return res
      .status(400)
      .json({ message: `Error en la actualización del blog` });
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogDeleted = await Blog.findByIdAndDelete(id);

    if (Array.isArray(blogDeleted.image)) {
      for (const imgUrl of blogDeleted.image) {
        deleteFile(imgUrl);
      }
    }
    return res
      .status(200)
      .json({ message: 'Entrada de blog eliminado:', blogDeleted });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error al eliminar la entrada de blog' });
  }
};

module.exports = {
  getBlogs,
  filterBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
