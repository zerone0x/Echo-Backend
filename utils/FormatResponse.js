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
function sendFail(res, statusCode, data = null, error = "Request Failed") {
  res.status(statusCode).json({
    status: "failed",
    results: data,
    message: error,
    error: error,
  });
}

module.exports = {
  sendSuccess,
  sendFail,
};
