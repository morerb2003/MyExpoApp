const AppError = require('../utils/appError');

function validate(requiredFields = []) {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return next(new AppError(`Missing required fields: ${missing.join(', ')}`, 400));
    }
    next();
  };
}

const validateTaskCreation = validate(['title']);
const validateTaskUpdate = (req, res, next) => {
  if (req.body.priority && !['low', 'medium', 'high'].includes(req.body.priority)) {
    return next(new AppError("Priority must be 'low', 'medium', or 'high'", 400));
  }
  if (req.body.status && !['todo', 'in-progress', 'completed'].includes(req.body.status)) {
    return next(new AppError("Status must be 'todo', 'in-progress', or 'completed'", 400));
  }
  next();
};

const validateNoteCreation = validate(['title']);
const validateEventCreation = validate(['title', 'date', 'time']);

module.exports = {
  validate,
  validateTaskCreation,
  validateTaskUpdate,
  validateNoteCreation,
  validateEventCreation,
};
