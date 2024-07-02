const express = require("express");
const router = express.Router();
const {
  AddFollowing,
  getFollowing,
  getFans,
} = require("../controllers/followController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/AddFollow").post([authenticateUser], AddFollowing);
router.route("/getFollow").get([authenticateUser], getFollowing);
router.route("/getFans").get([authenticateUser], getFans);
module.exports = router;
