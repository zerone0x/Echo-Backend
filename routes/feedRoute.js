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
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router
  .route("/")
  .post(authenticateUser, upload.array("image", 4), checkFileSize, createFeeds)
  .get(authenticateUser, getAllFeeds);

router.route("/user/:username").get(getFeedByUsername);
router.route("/user/:userId").get(getFeedByUserId);
router.route("/searchFeeds").post(searchFeeds);

router.route("/:id").get(getFeedById).delete(authenticateUser, deleteFeedById);

module.exports = router;
