const express = require("express");
const askRouter = require("./routes/ask");
const userRouter = require("./routes/ask");
const db = require("./models");

const app = express();

// DB 연결
db.sequelize
  .sync()
  .then(() => {
    console.log("DB SUCCESS");
  })
  .catch(console.error);

// Router
app.get("/", (req, res) => {
  res.send("hello home");
});

app.use("/asks", askRouter);
app.use("/users", userRouter);

app.listen(3065, () => {
  console.log("Listening on PORT 3065...");
});
