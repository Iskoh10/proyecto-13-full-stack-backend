const { deleteFile } = require('../../utils/deleteFile');
const { genericUpdate } = require('../../utils/genericUpdate');
const Workshop = require('../models/workshop');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const getWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find()
      .populate({
        path: 'user',
        select: 'name'
      })
      .populate({
        path: 'attendees',
        select: 'name'
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
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name'
        },
        select: 'text user'
      });
    return res.status(200).json(workshops);
  } catch (error) {
    return res.status(400).json('Error al recuperar todos los talleres');
  }
};

const filterWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find({
      $text: { $search: req.params.title }
    })
      .populate({
        path: 'user',
        select: 'name'
      })
      .populate({
        path: 'attendees',
        select: 'name'
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
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name'
        },
        select: 'text user'
      });
    return res.status(200).json(workshops);
  } catch (error) {
    return res.status(400).json('Error en el filtrado de talleres');
  }
};

const getWorkshopById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const workshop = await Workshop.findById(id)
      .populate({
        path: 'user',
        select: 'name'
      })
      .populate({
        path: 'attendees',
        select: 'name'
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
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name'
        },
        select: 'text user'
      });
    return res.status(200).json(workshop);
  } catch (error) {
    return res.status(400).json('Error al recuperar el taller');
  }
};

const createWorkshop = async (req, res, next) => {
  try {
    const newWorkshop = new Workshop(req.body);
    newWorkshop.user = req.user._id;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'workshops',
        resource_type: 'raw'
      });
      newWorkshop.fileUrl = uploadResult.secure_url;

      fs.unlink(req.file.path, (error) => {
        if (error) console.error('Error al eliminar archivo temporal:', error);
      });
    }

    const workshop = await newWorkshop.save();
    return res.status(201).json(workshop);
  } catch (error) {
    return res.status(400).json('Error al crear el nuevo taller');
  }
};

const updateWorkshop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const workshop = await Workshop.findById(id);

    if (!workshop) return res.status(404).json('Taller no encontrado');

    const userId = req.user._id;

    if (action === 'like') {
      workshop.dislikes = workshop.dislikes.filter(
        (user) => user.toString() !== userId.toString()
      );
      if (!workshop.likes.includes(userId)) {
        workshop.likes.push(userId);
      }
    } else if (action === 'dislike') {
      workshop.likes = workshop.likes.filter(
        (user) => user.toString() !== userId.toString()
      );
      if (!workshop.dislikes.includes(userId)) {
        workshop.dislikes.push(userId);
      }
      await workshop.save();
    } else if (req.body.body || req.body.title || req.files) {
      await genericUpdate({
        id,
        user: req.user,
        body: req.body,
        Model: Workshop,
        files: req.files
      });
    }

    const updated = await Workshop.findById(workshop._id)
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name lastName' }
      })
      .populate({ path: 'likes', select: 'name' })
      .populate({ path: 'dislikes', select: 'name' })
      .populate({ path: 'user', select: 'name' });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({
      message: `Error en la actualización del taller: ${error.message}`
    });
  }
};

const deleteWorkshop = async (req, res, next) => {
  try {
    const { id } = req.params;

    const workshopDeleted = await Workshop.findByIdAndDelete(id);

    deleteFile(workshopDeleted.fileUrl);

    return res
      .status(200)
      .json({ message: 'Taller eliminado:', workshopDeleted });
  } catch (error) {
    return res.status(400).json({ message: 'Error al eliminar el taller' });
  }
};

module.exports = {
  getWorkshops,
  filterWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop
};
