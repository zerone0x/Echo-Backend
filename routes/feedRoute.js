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
  bookmarkFeeds,
  getAllBookMarks,
  getFeedByUserId,
  getFeedByUsername,
} = require("../controllers/feedController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/").post([authenticateUser], createFeeds).get(getAllFeeds);

router.route("/uploadImage").post([authenticateUser], uploadImage);
router.route("/user/:username").get(getFeedByUsername);
router.route("/user/:userId").get(getFeedByUserId);
// reaction
router.route("/bookmark").post([authenticateUser], bookmarkFeeds);
router.route("/bookmark").get([authenticateUser], getAllBookMarks);

router
  .route("/:id")
  .get(getFeedById)
  .delete([authenticateUser], deleteFeedById);

module.exports = router;
