const User = require('../api/models/user');
const { jwtVerify } = require('../utils/jwt');

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const { id } = jwtVerify(token);

    const user = await User.findById(id).select('-password');
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    return res
      .status(403)
      .json({ message: 'Acceso denegado: requiere rol admin' });
  }
};

module.exports = { isAuth, isAdmin };
