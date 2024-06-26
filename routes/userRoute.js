const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrUser,
  updateUser,
  updateUserPwd,
  addFollowers,
  getUserByName,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

router.route("/").get(authenticateUser, getAllUsers);
// .get(authenticateUser, authorizePermission("admin"), getAllUsers);

router.route("/showMe").get( showCurrUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPwd").patch(authenticateUser, updateUserPwd);
router.route("/addFollowers").patch(authenticateUser, addFollowers);
router.route("/id/:id").get(authenticateUser, getSingleUser);
router.route("/username/:username").get(getUserByName);
module.exports = router;
