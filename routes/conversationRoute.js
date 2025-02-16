const express = require("express");
const router = express.Router();
const {
  getAllConversations,
  getConversationDetails,
} = require("../controllers/conversationController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/all").get(authenticateUser, getAllConversations);
router.route("/details").get(authenticateUser, getConversationDetails);

module.exports = router;
