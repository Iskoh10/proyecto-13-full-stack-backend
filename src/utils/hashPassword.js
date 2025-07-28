const bcrypt = require('bcrypt');

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = async (password, hashedpassword) => {
  return await bcrypt.compare(password, hashedpassword);
};

module.exports = { hashPassword, comparePassword };
