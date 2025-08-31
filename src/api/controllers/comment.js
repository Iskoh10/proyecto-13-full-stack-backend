const Comment = require('../models/comment');
const Product = require('../models/product');
const Workshop = require('../models/workshop');
const Blog = require('../models/blog');
const User = require('../models/user');

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate({
        path: 'user',
        select: 'name lastName'
      })
      .populate({
        path: 'eventId',
        select: 'title'
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name'
        },
        select: 'text user'
      })
      .select('text user comments');

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(400).json('Error al recuperar los comentarios');
  }
};

const filterComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      $text: { $search: req.params.text }
    }).populate('user');
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(400).json('Error en el filtrado de comentarios');
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id)
      .populate({
        path: 'user',
        select: 'name'
      })
      .populate({
        path: 'eventId',
        select: 'title'
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name'
        },
        select: 'text user'
      })
      .select('text user comments');

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(400).json('Error al recuperar el comentario');
  }
};

const createComment = async (req, res, next) => {
  const { text, target, eventId } = req.body;
  const userId = req.user._id;

  try {
    const newComment = new Comment({
      text,
      user: userId,
      target,
      eventId
    });

    const comment = await newComment.save();
    await comment.populate('user', 'name');

    const modelMap = {
      Product,
      Workshop,
      Blog,
      Comment
    };

    const Model = modelMap[target];
    await Model.findByIdAndUpdate(
      eventId,
      { $push: { comments: comment._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      { $push: { comments: comment._id } },
      { new: true }
    );

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(400).json('Error al crear el comentario');
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(id, comment, {
      new: true
    });

    return res.status(200).json({
      message: 'Comentario actualizado correctamente',
      comment: updatedComment
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error en la actualización del comentario' });
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const commentDeleted = await Comment.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: 'Comentario eliminado:', commentDeleted });
  } catch (error) {
    return res.status(400).json({ message: 'Error al eliminar el comentario' });
  }
};

module.exports = {
  getComments,
  filterComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
};
