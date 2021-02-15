const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Ask } = require("../models");
const { isNotLoggedIn } = require("./middlewares");
const router = express.Router();

/*
    /asks/:targetUserId
    특정 유저에게 ask 보내기

*/

// 익명 질문 특정 유저에게 질문하기 POST /asks/:targetUserId
router.post("/:targetUserId", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.targetUserId },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    const ask = await Ask.create({
      nickname: req.body.nickname,
      content: req.body.content,
      UserId: req.body.targetUserId,
    });
    res.status(201).json(ask);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET asks/
router.get("/", async (req, res, next) => {
  try {
    const asks = await Ask.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
    });
    res.status(201).json(asks);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
