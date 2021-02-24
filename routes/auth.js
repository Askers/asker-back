const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");
const { isNotLoggedIn, isLoggedIn } = require("./middlewares");
const router = express.Router();

/*
    /auth
    - GET  /auth

    /auth/signup
    - POST /auth/signup

    /auth/login
    - POST auth/login

    /auth/1/logout
    - POST /auth/logout

*/

/*
-----------------------
LOCAL OAUTH
-----------------------
*/
// GET /auth
// 로그인한 유저의 정보 리턴
router.get("/", async (req, res, next) => {
  try {
    console.log("로그인 여부 체크");
    if (req.user) {
      const myInfoWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        // password 제외
        attributes: { exclude: ["password"] },
      });
      return res.status(201).json(myInfoWithoutPassword);
    }
    res.status(200).json(null);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/*
-----------------------
USER INFO CHECKING
-----------------------
*/

// GET /auth/:userId
// 해당 라우터의 유저 정보 리턴
router.get("/users/:userId", async (req, res, next) => {
  try {
    const userData = await User.findOne({
      where: { id: req.params.userId },
      attributes: { exclude: ["password"] },
    });

    if (!userData) {
      return res.status(404).send("존재하지 않는!!! 유저입니다.");
    }
    res.status(201).json(userData);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/*
-----------------------
LOG IN
-----------------------
*/

// POST /auth/login
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const myInfoWithoutPassword = await User.findOne({
        where: { id: user.id },
        // password 제외
        attributes: { exclude: ["password"] },
      });
      return res.status(201).json(myInfoWithoutPassword);
    });
  })(req, res, next);
});

/*
-----------------------
LOG OUT
-----------------------
*/
// POST /logout
router.post("/logout", isLoggedIn, async (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

/*
-----------------------
SIGN UP
-----------------------
*/

// POST /signup
router.post("/signup", isNotLoggedIn, async (req, res, next) => {
  try {
    // 기존 유저와 매치
    const existUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    console.log(existUser);
    if (existUser) {
      return res.status(403).send("이미 사용 중인 email 입니다.");
    }
    // password hash
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });
    res.status(201).json("ok");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/*
-----------------------
TWITTER OAUTH
-----------------------
*/

// Twitter OAuth
router.get(
  "/twitter",
  passport.authenticate("twitter", { scope: ["profile"] })
);

// Twitter Callback
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("http://localhost:3000/login");
  }
);

/*
-----------------------
GOOGLE OAUTH
-----------------------
*/

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("http://localhost:3000/login");
  }
);
module.exports = router;
