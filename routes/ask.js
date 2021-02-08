const express = require("express");
const router = express.Router();
const { Ask, User } = require("../models");

// 익명 질문 특정 유저에게 질문하기 POST /ask/<username>/ask
router.post("/:username/ask", async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: { username: req.body.username },
    });
    if (!username) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    const ask = await Ask.create({
      nickname: req.body.nickname,
      content: req.body.content,
      userId: req.body.username,
    });
    res.status(201).json(ask);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
