const morgan = require('morgan');

// Simple logger using morgan
const logger = morgan('combined');

module.exports = logger;
