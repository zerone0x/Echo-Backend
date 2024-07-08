const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 配置 CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "EchoAPP",
      allowedFormats: ["jpeg", "png", "jpg"],
      public_id: `${req.user.userId}-${Date.now()}`, // 假设你想用用户ID和时间戳命名文件
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

// 导出 parser
module.exports = parser;
