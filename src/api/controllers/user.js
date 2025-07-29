const { sendEmail } = require('../../config/nodemailer');
const { hashPassword, comparePassword } = require('../../utils/hashPassword');
const { generateSign } = require('../../utils/jwt');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate({
      path: 'comments',
      select: 'text'
    });
    return res
      .status(200)
      .json({ message: 'Estos son los usuarios registrados:', users });
  } catch (error) {
    return res.status(400).json('Error en la recuperación de los usuarios');
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'comments',
      select: 'text'
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario encontrado:', user });
  } catch (error) {
    return res.status(400).json('Error en la recuperación del usuario');
  }
};

const filterByUsername = async (req, res, next) => {
  try {
    const query = {
      name: { $regex: req.params.name, $options: 'i' }
    };

    const users = await User.find(query).populate({
      path: 'comments',
      select: 'text'
    });
    return res.status(200).json({ message: 'Hemos encontrado a:', users });
  } catch (error) {
    return res.status(400).json('Error en la recuperación de usuarios');
  }
};

const register = async (req, res, next) => {
  try {
    const newUser = new User(req.body);

    newUser.role = 'user';

    const userDuplicated = await User.findOne({ email: req.body.email });
    if (userDuplicated)
      return res.status(400).json({ message: 'Usuario ya existente' });

    newUser.password = hashPassword(req.body.password);

    const user = await newUser.save();

    sendEmail({ email: newUser.email, password: req.body.password });

    return res.status(201).json({ message: 'Usuario creado: ', user });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Error en el registro del usuario' });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: 'Usuario o contraseña erróneos' });

    const isMatch = await comparePassword(password, user.password);

    if (isMatch) {
      const token = generateSign(user._id);
      return res.status(200).json({ token, user });
    } else {
      return res.status(400).json({ message: 'Usuario o contraseña erróneos' });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Error al loguearte' });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newUser = new User(req.body);
    const oldUser = await User.findById(id);

    newUser._id = id;
    newUser.role = 'user';
    newUser.comments = [
      ...(oldUser.comments || []),
      ...(newUser.comments || [])
    ];
    newUser.messages = [
      ...(oldUser.messages || []),
      ...(newUser.messages || [])
    ];

    const user = await User.findByIdAndUpdate(id, newUser, { new: true });

    return res
      .status(200)
      .json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    return res.status(400).json('Error al actualizar usuario');
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDeleted = await User.findOneAndDelete(id);
    return res.status(200).json({ message: 'Usuario elminado: ', userDeleted });
  } catch (error) {
    return res.status(400).json({ message: 'Error al eliminar al usuario' });
  }
};

module.exports = {
  getUsers,
  getUser,
  filterByUsername,
  register,
  login,
  updateUser,
  deleteUser
};
