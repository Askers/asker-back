const express = require("express");
const passport = require("passport");
const router = express.Router();

// /auth/twitter
router.get(
  "/twitter",
  passport.authenticate("twitter", { scope: ["profile"] })
);

// /auth/twitter/callback
// 검증을 마치고 전달해주는 주소
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/auth/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(`/${req.user.user_id}`);
  }
);

module.exports = router;
