const express = require("express");
const router = express.Router();
const {
  LikeFeed,
  CreateLikesComment,
  getAllLikesByUserId,
} = require("../controllers/likesController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/likedfeed").post([authenticateUser], LikeFeed);
router.route("/getAllLikes").get([authenticateUser], getAllLikesByUserId);
module.exports = router;
