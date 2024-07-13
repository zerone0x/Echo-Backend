const express = require("express");
const router = express.Router();
const {
  deleteCommentById,
  getAllComments,
  getCommentById,
  getCommentsByFeedID,
} = require("../controllers/commentController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/").get(getAllComments);

router.route("/getCommentsByFeedID/:feedId").get(getCommentsByFeedID);
router
  .route("/:id")
  .get(getCommentById)
  .delete(authenticateUser, deleteCommentById);

module.exports = router;
