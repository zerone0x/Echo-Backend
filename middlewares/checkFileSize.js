const maxSize = 1024 * 1024; // 1MB

function checkFileSize(req, res, next) {
  if (req.file && req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: "File size should be less than 1MB",
    });
  }
  next();
}

module.exports = checkFileSize;
