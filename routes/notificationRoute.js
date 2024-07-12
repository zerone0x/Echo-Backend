const express = require("express");
const router = express.Router();
const {
  GetAllNotifications,
  MarkRead,
} = require("../controllers/notificationController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router
  .route("/GetAllNotifications")
  .get([authenticateUser], GetAllNotifications);
router.route("/MarkRead").post([authenticateUser], MarkRead);
module.exports = router;
