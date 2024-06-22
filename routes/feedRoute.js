const express = require("express");
const router = express.Router();
const {
  createFeeds,
  getAllFeeds,
  getFeedById,
  updateFeedById,
  deleteFeedById,
  uploadImage,
  searchFeeds,
  getFeedByUserId,
} = require("../controllers/feedController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/").post([authenticateUser], createFeeds).get(getAllFeeds);

router.route("/uploadImage").post([authenticateUser], uploadImage);

router.route("/user/:userId").get(getFeedByUserId);

router
  .route("/:id")
  .get(getFeedById)
  .delete([authenticateUser], deleteFeedById);

module.exports = router;
