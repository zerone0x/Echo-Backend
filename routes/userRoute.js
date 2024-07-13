const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrUser,
  updateUser,
  updateUserPwd,
  getUserByName,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");
const checkFileSize = require("../middlewares/checkFileSize");
const upload = require("../middlewares/upload");

router.route("/").get(authenticateUser, getAllUsers);
// .get(authenticateUser, authorizePermission("admin"), getAllUsers);

router.route("/showMe").get(showCurrUser);
router.post(
  "/updateUser",
  authenticateUser,
  upload.fields([
    { name: "ProfileImage", maxCount: 1 },
    { name: "Banner", maxCount: 1 },
  ]),
  checkFileSize,
  updateUser,
);
router.route("/updateUserPwd").patch(authenticateUser, updateUserPwd);
router.route("/id/:id").get(authenticateUser, getSingleUser);
router.route("/username/:username").get(getUserByName);
module.exports = router;
