function errorHandler(error, req, res, next) {
  console.log(error);

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
}

export default errorHandler;
