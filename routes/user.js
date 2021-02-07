const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Answer } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ id: "hi" });
});
// POST /user
router.post("/", isNotLoggedIn, async (req, res, next) => {
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
    res.status(201).send("ok");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /user/login
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
      const userInfoWithoutPassword = await User.findOne({
        where: { id: user.id },
        // password 제외
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Answer,
          },
        ],
      });
      return res.status(201).json(userInfoWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("logout okk");
});

module.exports = router;
