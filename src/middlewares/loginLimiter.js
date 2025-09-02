const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos fallidos. Inténtalo de nuevo más tarde.'
});

module.exports = { loginLimiter };
