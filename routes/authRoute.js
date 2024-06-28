const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  register,
  login,
  logout,
  RedirectGoogle,
  RedirectGithub,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["profile"],
  }),
);
router.get("/google/redirect", passport.authenticate("google"), RedirectGoogle);
router.get("/github/redirect", passport.authenticate("github"), RedirectGithub);

module.exports = router;
