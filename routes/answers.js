const express = require("express");
const { Ask, Answer } = require("../models");
const { Op } = require("sequelize");
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
    const userId = parseInt(req.params.userId);
    const where = { target_user_id: userId };

    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때
      // id가 lastId 보다 작은
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const answers = await Answer.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Ask,
          attributes: ["id", "nickname", "content"],
        },
      ],
    });
    res.status(201).json(answers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 특정 답변 가져오기 GET /:userId/:answerId
router.get("/get/:answerId", async (req, res, next) => {
  try {
    // console.log("특정답변가져오기");
    const answerId = parseInt(req.params.answerId);
    const askId = parseInt(req.query.askId);

    // console.log(answerId);
    // console.log(askId);
    const answer = await Answer.findOne({
      where: { id: answerId, linked_ask_id: askId },
      include: [
        {
          model: Ask,
          attributes: ["id", "nickname", "content"],
        },
      ],
    });
    // 답변이 없으면
    if (!answer) {
      return res.status(403).send("이미 삭제된 답변입니다.");
    }

    // 답변이 있으면
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 특정 질문에 대답하기 POST /answers/askId
router.post("/:askId", isLoggedIn, async (req, res, next) => {
  try {
    const askId = parseInt(req.params.askId);
    console.log("질문에 답변: POST 라우터 실행");
    const ask = await Ask.findOne({
      where: { id: askId },
    });
    console.log(ask);
    if (!ask) {
      // 해당 질문이 없으면 리다이렉트
      return res.status(403).send("존재하지 않는 ask입니다.");
    }
    // 해당 질문이 있으면 is_answered를 true로 변경
    await Ask.update(
      {
        isAnswered: true,
      },
      {
        where: { id: askId },
      }
    );

    const answer = await Answer.create({
      content: req.body.answer,
      linked_ask_id: askId,
      target_user_id: req.user.id,
    });

    // 리다이렉트 걸어주면 좋겠다...
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 특정 답변 삭제하기
router.delete(
  "/:answerId/delete/:askId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      console.log("답변 삭제: DELETE 라우터 실행");
      const answerId = parseInt(req.params.answerId);
      const askId = parseInt(req.params.askId);

      // 해당 답변에 연결된 ask의 is_answered 컬럼값 false로 변경
      await Ask.update(
        {
          isAnswered: false,
        },
        {
          where: { id: askId },
        }
      );

      // 답변 삭제
      await Answer.destroy({
        where: {
          id: answerId,
          target_user_id: req.user.id,
        },
      });

      res.status(201).send("답변을 삭제했습니다.");
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

module.exports = router;
