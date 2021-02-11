const express = require("express");
const { Ask } = require("../models");
const { User } = require("../models");
const router = express.Router();

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

// 익명 질문 특정 유저에게 질문하기 POST /asks
router.post("/", async (req, res, next) => {
  console.log(req);
  try {
    const user = await User.findOne({
      where: { id: req.body.targetUserId },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    const ask = await Ask.create({
      nickname: req.body.nickname,
      content: req.body.content,
      UserId: req.body.targetUserId,
    });
    res.status(201).json("ok");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
