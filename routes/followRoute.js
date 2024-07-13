const express = require("express");
const router = express.Router();
const {
  AddFollowing,
  getFollowing,
  getFans,
  getIsFollowed,
} = require("../controllers/followController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/AddFollow/").post(authenticateUser, AddFollowing);
router.route("/getFollow/:username").get(getFollowing);
router.route("/getFans/:username").get(getFans);
router.route("/getIsFollowed/:username").get(authenticateUser, getIsFollowed);
module.exports = router;
