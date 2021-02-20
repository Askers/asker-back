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
// 프론트에서 보낸 라우터의 유저 주소와 req.user의 값이 같은 경우만 반환
router.get("/:userId", async (req, res, next) => {
  if (req.user === req.params.userId) {
    try {
      const asks = await Ask.findAll({
        where: { UserId: req.user },
        limit: 10,
        order: [["createdAt", "DESC"]],
      });
      res.status(201).json(asks);
    } catch (err) {
      console.error(err);
      next(err);
    }
  } else {
    res.status(500).send("잘못된 접근입니다.");
  }
});

module.exports = router;
