const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");
const { isNotLoggedIn } = require("./middlewares");
const router = express.Router();

/*
    /auth
    - GET  /auth

    /auth/signup
    - POST /auth/signup

    /auth/login
    - POST auth/login

    /auth/1/logout
    - POST /auth/<:userId>/logout

*/

// GET /auth
// 로그인한 유저의 정보 리턴
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const myInfoWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        // password 제외
        attributes: { exclude: ["password"] },
      });
      res.status(201).json(myInfoWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

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
