const express = require("express");
const router = express.Router();
const {
  BookMarkFeed,
  CancelBookMarkFeed,
  getAllBookmarksByUserId,
} = require("../controllers/bookmarkController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

// router.route("/").post([authenticateUser], createFeeds).get(getAllFeeds);

router.route("/booked").post([authenticateUser], BookMarkFeed);
router.route("/cancelbooked").post([authenticateUser], CancelBookMarkFeed);
router
  .route("/getAllBookMark")
  .get([authenticateUser], getAllBookmarksByUserId);

module.exports = router;
