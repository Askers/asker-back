const express = require("express");
const cors = require("cors");
const askRouter = require("./routes/ask");
const userRouter = require("./routes/ask");
const db = require("./models");
const { urlencoded } = require("express");

const app = express();

// DB 연결
db.sequelize
  .sync()
  .then(() => {
    console.log("DB SUCCESS");
  })
  .catch(console.error);

// CORS ERROR solution
app.use(
  cors({
    origin: "*",
    credentials: false, // 나중에 true로 바꿔야 함
  })
);

// Front 연결
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Router
app.get("/", (req, res) => {
  res.send("hello home");
});

app.use("/ask", askRouter);
app.use("/user", userRouter);

app.listen(3065, () => {
  console.log("Listening on PORT 3065...");
});
