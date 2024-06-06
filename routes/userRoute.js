const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrUser,
  updateUser,
  updateUserPwd,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router
  .route("/")
  .get(authenticateUser, authorizePermission("admin"), getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPwd").patch(authenticateUser, updateUserPwd);
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
