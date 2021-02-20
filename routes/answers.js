const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User, Ask, Answer } = require("../models");
const { isNotLoggedIn, isLoggedIn } = require("./middlewares");
const router = express.Router();

/*

    GET  /answers
    
    POST /answers/askId
    특정 질문에 answer 붙이기

*/

// GET answers/
// 라우터의 유저 아이디와 작성자가 일치하는 모든 asks
router.get("/:userId", async (req, res, next) => {
  try {
    const answers = await Answer.findAll({
      where: { target_user_id: req.params.userId },
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
router.post("/:askId", isLoggedIn, async (req, res, next) => {
  try {
    const ask = await Ask.findOne({
      where: { id: req.params.askId },
    });
    if (!ask) {
      return res.status(403).send("존재하지 않는 ask입니다.");
    }
    const answer = await Answer.create({
      content: req.body.answer,
      linked_ask_id: req.params.askId,
      target_user_id: req.user.id,
      is_answered: true,
    });
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
