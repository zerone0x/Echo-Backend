const express = require("express");
const router = express.Router();
const {
  BookMarkFeed,
  getAllBookmarksByUserId,
  getIsBooked,
} = require("../controllers/bookmarkController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/booked").post([authenticateUser], BookMarkFeed);
router
  .route("/getAllBookMark")
  .get([authenticateUser], getAllBookmarksByUserId);
router
  .route("/getIsBooked/:feedId/:itemType")
  .get([authenticateUser], getIsBooked);

module.exports = router;
