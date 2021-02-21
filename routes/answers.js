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
      include: [
        {
          model: Ask,
          attributes: ["nickname", "content"],
        },
      ],
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
    const existAnswer = await Answer.findOne({
      where: { linked_ask_id: req.params.askId },
    });
    if (existAnswer !== null) {
      return res.status(403).send("이미 답변한 질문입니다.");
    }
    const answer = await Answer.create({
      content: req.body.answer,
      linked_ask_id: req.params.askId,
      target_user_id: req.user.id,
    });

    // 리다이렉트 걸어주면 좋겠다...
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 특정 질문 삭제하기
router.delete("/:answerId", isLoggedIn, async (req, res, next) => {
  try {
    await Answer.destroy({
      where: {
        id: req.params.answerId,
        target_user_id: req.user.id,
      },
    });

    res.status(201).send("답변을 삭제했습니다.");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
