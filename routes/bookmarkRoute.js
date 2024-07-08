const express = require("express");
const router = express.Router();
const {
  BookMarkFeed,
  CancelBookMarkFeed,
  getAllBookmarksByUserId,
  getIsBooked,
} = require("../controllers/bookmarkController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/booked").post([authenticateUser], BookMarkFeed);
router.route("/cancelbooked").post([authenticateUser], CancelBookMarkFeed);
router
  .route("/getAllBookMark")
  .get([authenticateUser], getAllBookmarksByUserId);
router.route("/getIsBooked/:feedId").get([authenticateUser], getIsBooked);

module.exports = router;
