const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "EchoAPP",
      allowedFormats: ["jpeg", "png", "jpg", "gif"],
      public_id: `${req.user.userId}-${Date.now()}`,
    };
  },
});

// 配置 multer
const parser = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 限制为2MB
  },
});

module.exports = parser;
