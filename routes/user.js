const express = require("express");

const { User, Ask } = require("../models");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();

/*
  PUBLIC
    유저 메인 홈: users/1
    - GET /users/<:userId>

    특정 answer 하나만 보여주는 페이지: users/1/1
    - GET /users/<:userId>/<:answerId>


  PRIVATE
    유저 어드민 페이지: users/1/admin
    - GET /users/<:userId>/<:answerId>

    특정 ask에 답변: users/1/admin/1
    - POST /users/<:userId>/<askId>

    
  FUNCTION
    `본인 로그인 정보: /user
    - /user
    
    특정 answer 삭제: users/1/1/delete
    - DELETE /users/<:userId>/<:answerId>/delete   
*/

// 본인 정보: me
// GET /user
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const myInfoWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        // password 제외
        attributes: { exclude: ["password"] },
      });
      res.status(200).json(myInfoWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// // GET /user/<특정유저id>/index의 정보를 가져올 때
// // req.user === userId 조건을 만족하지 않아도 괜찮음
// router.get("/:userId", async (req, res, next) => {
//   try {
//     const user = await Users.fineOne({
//       where: { id: req.params.id },
//       include: [
//         {
//           model: Asks,
//         },
//       ],
//     });
//     if (!user) {
//       return res.status(404).send("존재하지 않는 유저입니다.");
//     }
//     const userProfile = await User.findOne({
//       where: { id: this.user.id },
//       include: [
//         {
//           model: Asks,
//           // targetId가 userId와 일치하는 것만...
//         },
//       ],
//     });
//     res.status(200).json(userProfile);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("logout okk");
});

module.exports = router;
