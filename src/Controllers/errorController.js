import MakeError from './../utils/MakeError.js';

export const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //handle unhandled errors
  let error = Object.create(err);
  if (err.name === 'CastError') error = castError(err);
  if (err.name === 'ValidationError') error = validationError(err);
  if (err.name === 'JsonWebTokenError') error = invalidJwtToken();
  if (err.name === 'TokenExpiredError') error = expiredJwtToken();
  if (err.code === 'LIMIT_FILE_SIZE') error = largeFileError(err);
  if (err.code === 11000) error = duplicateKey(err);
  //send proper error response
  if (process.env.NODE_ENV === 'production') {
    prodError(error, res);
  } else if (process.env.NODE_ENV === 'development') {
    console.log(err);
    devError(error, res);
  }
};

//production error
function prodError(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
}
//development error
function devError(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

//cast error || invalid field
function castError(err) {
  return new MakeError(`Invalid ${err.path}:${err.value}`, 400);
}

//mongoose validation error
function validationError(err) {
  return new MakeError(err.message, 400);
}
//mongodb duplicate key error
function duplicateKey(err) {
  return new MakeError(
    `The ${Object.keys(
      err.keyValue
    )} is already used. Please use another ${Object.keys(err.keyValue)}.`,
    400
  );
}
//jsonwebtoken invalid signature error
function invalidJwtToken() {
  return new MakeError('You token is invalid. Please log in again.', 401);
}
//expired jwt token error
function expiredJwtToken() {
  return new MakeError('You token is expired. Please log in again.', 401);
}
// large file upload error
function largeFileError(err) {
  return new MakeError(
    `Uploaded ${err.field} size must not be more than 1MG!`,
    400
  );
}
