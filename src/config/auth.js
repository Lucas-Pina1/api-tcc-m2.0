const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  secret: process.env.JWT_SECRET || 'default_fallback_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
};
