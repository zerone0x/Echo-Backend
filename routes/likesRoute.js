const express = require("express");
const router = express.Router();
const {
  LikeFeed,
  CreateLikesComment,
  getAllLikesByUserId,
  getIsLiked,
} = require("../controllers/likesController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/likedfeed").post([authenticateUser], LikeFeed);
router.route("/getAllLikes").get([authenticateUser], getAllLikesByUserId);
router.route("/getIsLiked/:feedId").get([authenticateUser], getIsLiked);
module.exports = router;
