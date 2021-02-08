const express = require("express");
const passport = require("passport");
const router = express.Router();

// /auth/twitter
router.get("/twitter", passport.authenticate("twitter"));

// /auth/twitter/callback
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
