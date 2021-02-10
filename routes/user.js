const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Ask } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

// GET /user
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const myInfoWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        // password 제외
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Ask,
          },
        ],
      });
      res.status(200).json(myInfoWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET /user/<특정유저id> 타인의 정보를 가져올 때
router.get("/:userId", async (req, res, next) => {
  try {
    const userInfoWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      // password 제외
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Ask,
        },
      ],
    });
    // 개인정보 보호
    // 내역이 리스트로 전부 전달되지 않도록
    const data = userInfoWithoutPassword.toJSON();
    data.Asks = data.Asks.length();
    if (userInfoWithoutPassword) {
      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 유저입니다.");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /user 회원가입
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
      const myInfoWithoutPassword = await User.findOne({
        where: { id: user.id },
        // password 제외
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Ask,
          },
        ],
      });
      return res.status(201).json(myInfoWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("logout okk");
});

module.exports = router;
