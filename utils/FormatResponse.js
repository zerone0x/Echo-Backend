function sendSuccess(
  res,
  statusCode,
  data = null,
  message = "Request successful",
) {
  res.status(statusCode).json({
    status: "success",
    results: data,
    message: message,
    error: null,
  });
}

module.exports = {
  sendSuccess,
};
