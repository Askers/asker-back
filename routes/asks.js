const express = require("express");
const { Op } = require("sequelize");
const { User, Ask } = require("../models");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();

/*
    /asks/:targetUserId
    특정 유저에게 ask 보내기

*/

// 익명 질문 특정 유저에게 질문하기 POST
router.post("/:userId", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
    const ask = await Ask.create({
      nickname: req.body.nickname,
      content: req.body.content,
      target_user_id: req.params.userId,
    });
    res.status(201).json(ask);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET asks/
// 1/admin 부분에 들어가는 데이터 전송
// 프론트에서 보낸 라우터의 유저 주소와 req.user의 값이 같을 때 반환
router.get("/:userId", async (req, res, next) => {
  const userId = parseInt(req.params.userId);

  if (req.user.id !== userId) {
    return res.status(503).send("잘못된 접근입니다.");
  }

  try {
    // 해당 라우터 유저 정보(username과 일치, is_answered: true 제외)
    const where = { target_user_id: userId, is_answered: false };

    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐때
      // ask가 10보다 작을 때
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10),
      };
    }
    const asks = await Ask.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]],
    });
    res.status(201).json(asks);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE 특정 ASK
router.delete("/:askId", isLoggedIn, async (req, res, next) => {
  try {
    // 있으면 삭제
    await Ask.destroy({
      where: {
        id: req.params.askId,
        target_user_id: req.user.id,
      },
    });

    res.status(201).send("성공적으로 삭제했습니다.");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
