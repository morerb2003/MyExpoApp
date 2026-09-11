const { errorResponse } = require("../utils/apiResponse");

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error("[Error]", err);
  }

  return errorResponse(res, message, statusCode, err.errors || null);
}

module.exports = errorHandler;
