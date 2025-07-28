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
    });
    return res.status(200).json(workshops);
  } catch (error) {
    console.log(error);
    return res.status(400).json('Error en el filtrado de talleres');
  }
};

const getWorkshopById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const workshop = await Workshop.findById(id).populate('user', 'name');
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
    const updated = await genericUpdate({
      id: req.params.id,
      user: req.user,
      body: req.body,
      Model: Workshop,
      filePdf: req.file
    });

    return res.status(200).json({
      message: 'El Taller se ha actualizado correctamente',
      updated
    });
  } catch (error) {
    if (error.message === 'Imagen no encontrada') {
      return res.status(404).json('Pdf no encontrada');
    } else if (error.message === 'Evento no encontrado') {
      return res.status(404).json('Taller no encontrado');
    }
    return res
      .status(400)
      .json({ message: `Error en la actualización del taller` });
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
    console.log(error);

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
