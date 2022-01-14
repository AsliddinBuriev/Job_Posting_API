export default (res, statusCode, data = null) => {
  res.status(statusCode).json({
    status: 'success',
    data: { data },
  });
};
