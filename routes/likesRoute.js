const express = require("express");
const router = express.Router();
const {
  LikeFeed,
  CreateLikesComment,
  GetCountOfLikes,
  getAllLikesByUserId,
  getIsLiked,
} = require("../controllers/likesController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/likedfeed").post(authenticateUser, LikeFeed);
router.route("/GetCountOfLikes/:feedId/:itemType").get(GetCountOfLikes);
router.route("/getAllLikes").get(authenticateUser, getAllLikesByUserId);
router.route("/getIsLiked/:feedId/:itemType").get(authenticateUser, getIsLiked);
module.exports = router;
