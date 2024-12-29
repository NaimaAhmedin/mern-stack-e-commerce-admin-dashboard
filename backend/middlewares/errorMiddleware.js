const errorMiddleware = (err, req, res, next) => {
  // Log the full error for server-side debugging
  console.error('Error Details:', {
    message: err.message,
    name: err.name,
    stack: err.stack,
    errors: err.errors,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});

    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }

  // Determine status code based on error type
  const statusCode = 
    err.statusCode || 
    (err.name === 'ValidationError' ? 400 : 
    (err.name === 'UnauthorizedError' ? 401 : 
    (err.name === 'ForbiddenError' ? 403 : 500)));

  // Prepare error response
  const errorResponse = {
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      fullError: err
    })
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorMiddleware;