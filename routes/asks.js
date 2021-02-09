const express = require("express");
const { Ask } = require("../models");
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

module.exports = router;
