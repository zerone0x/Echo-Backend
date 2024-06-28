const express = require("express");
const router = express.Router();
const {
  CreateLikesFeed,
  CreateLikesComment,
} = require("../controllers/likesController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

// router.route("/").post([authenticateUser], createFeeds).get(getAllFeeds);

router
  .route("/:id")
  .post([authenticateUser], CreateLikesFeed)
  .post([authenticateUser], CreateLikesComment);

module.exports = router;
