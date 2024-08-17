const express = require("express");
const router = express.Router();
const {
  createFeeds,
  getAllFeeds,
  getFeedById,
  updateFeedById,
  deleteFeedById,
  searchFeeds,
  getFeedByUserId,
  getFeedByUsername,
} = require("../controllers/feedController");
const checkFileSize = require("../middlewares/checkFileSize");
const upload = require("../middlewares/upload");
const rateLimit = require('express-rate-limit');
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 每个用户每15分钟最多允许5次请求
 
});

router
  .route("/")
  .post(
    authenticateUser, 
    limiter, 
    upload.array("image", 4), 
    checkFileSize, 
    createFeeds
  )
  .get(getAllFeeds);

router.route("/user/:username").get(getFeedByUsername);
router.route("/user/:userId").get(getFeedByUserId);
router.route("/searchFeeds").post(searchFeeds);

router.route("/:id").get(getFeedById).delete(authenticateUser, deleteFeedById);

module.exports = router;
