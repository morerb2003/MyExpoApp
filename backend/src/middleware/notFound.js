const AppError = require("../utils/appError");

function notFound(req, res, next) {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Route not found`, 404));
}

module.exports = notFound;
