const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  //post/ask
  res.json({ id: 1, content: "Hi" });
});

router.delete("/", (req, res) => {
  //delete/post
  res.json({ id: 1 });
});

module.exports = router;
