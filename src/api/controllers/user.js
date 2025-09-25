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

    const token = generateSign(newUser._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // secure: false,
      sameSite: 'none',
      // sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res
      .status(201)
      .json({ message: 'Usuario creado: ', userWithoutPassword });
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

    if (user.isDeleted) {
      return res.status(403).json({ message: 'Usuario eliminado' });
    }

    const isMatch = await comparePassword(password, user.password);

    if (isMatch) {
      const token = generateSign(user._id);
      const userNoPassword = user.toObject();
      delete userNoPassword.password;
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // secure: false,
        sameSite: 'none',
        // sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
      });
      return res.status(200).json({ user: userNoPassword });
    } else {
      return res.status(400).json({ message: 'Usuario o contraseña erróneos' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al loguearte' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return res.status(200).json({ message: 'Sesión cerrada' });
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const oldUser = await User.findById(id);
    if (!oldUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updatedData = {
      ...oldUser.toObject(),
      ...req.body,
      role: oldUser.role,
      comments: [...(oldUser.comments || []), ...(req.body.comments || [])],
      message: [...(oldUser.messages || []), ...(req.body.messages || [])]
    };

    if (req.body.password) {
      updatedData.password = hashPassword(req.body.password);
    }

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    return res
      .status(200)
      .json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    return res.status(400).json('Error al actualizar usuario');
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.body.id || req.user._id;

    if (req.body.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'No tienes permiso para eliminar a otros usuarios' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: 'Usuario Eliminado',
        lastName: null,
        email: `deleted_${userId}@example.com`,
        phone: null,
        address: null,
        password: '!',
        isDeleted: true
      },
      {
        new: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (userId.toString() === req.user._id.toString()) {
      res.clearCookie('token');
    }

    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
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
  logout,
  updateUser,
  deleteUser
};
