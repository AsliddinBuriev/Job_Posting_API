export default (res, resData) => {
  let { statusCode, data, message } = resData;
  message = message || 'Your request has been completed!';
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};
