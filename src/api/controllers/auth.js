const req = require('express/lib/request');
const User = require('../models/user');

const getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });

    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = getProfile;
