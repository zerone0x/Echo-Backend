const express = require("express");
const router = express.Router();
const {
  SendMessage,
  GetMessagesOfConversation,
  GetAllMessages,
} = require("../controllers/msgController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.post("/send", authenticateUser, SendMessage);
router
  .route("/receive/:receiverName")
  .get(authenticateUser, GetMessagesOfConversation);
router.route("/all").get(authenticateUser, GetAllMessages);
module.exports = router;
