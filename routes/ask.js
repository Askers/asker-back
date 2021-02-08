const express = require("express");
const router = express.Router();
const { Ask } = require("../models");

// 질문하기 POST /ask
router.post("/", async (req, res, next) => {
  try {
    console.log(req);
    const ask = await Ask.create({
      nickname: req.body.nickname,
      content: req.body.content,
    });
    res.status(201).json(ask);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
