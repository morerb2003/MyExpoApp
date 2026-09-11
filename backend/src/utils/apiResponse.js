class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data = null, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}

function successResponse(res, data = null, message = 'Success', statusCode = 200) {
  return ApiResponse.success(res, data, message, statusCode);
}

function errorResponse(res, message = 'An error occurred', statusCode = 500, errors = null) {
  return ApiResponse.error(res, message, statusCode, errors);
}

module.exports = {
  ApiResponse,
  successResponse,
  errorResponse,
};
