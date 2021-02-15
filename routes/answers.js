const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Ask, Answer } = require("../models");
const { isNotLoggedIn } = require("./middlewares");
const router = express.Router();

/*

    GET  /answers
    
    POST /answers/askId
    특정 질문에 answer 붙이기

*/

// GET answers/
router.get("/", async (req, res, next) => {
  try {
    const answers = await Answer.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
    });
    res.status(201).json(answers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 특정 질문에 대답하기 POST /answers/askId
router.post("/:targetAskId", async (req, res, next) => {
  try {
    const ask = await Ask.findOne({
      where: { id: req.params.targetUserId },
    });
    if (!ask) {
      return res.status(403).send("존재하지 않는 ask입니다.");
    }
    const answer = await Answer.create({
      content: req.body.content,
      AskId: req.body.targetAskId,
      UserId: req.user.id,
      isAnswered: true,
    });
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
