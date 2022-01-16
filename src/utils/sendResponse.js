export default (res, statusCode, data = null) => {
  const message = 'Your request has been completed!';
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};
