const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const router = express.Router();

// signup Router: POST /user
router.post("/", async (req, res, next) => {
  try {
    // 기존 유저와 매치
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용 중인 email 입니다.");
    }
    // password hash
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });
    // res.setHeader("Access-Contol-Allow-Origin", "http://localhost:3060");
    // 근데 그냥 미들웨어로 처리함
    res.status(201).send("ok");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
