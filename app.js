const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const passport = require("passport");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const askRouter = require("./routes/ask");

const db = require("./models");
const { urlencoded } = require("express");

dotenv.config();
const passportConfig = require("./passport");
const app = express();

// DB 연결
// alter: true
db.sequelize
  .sync()
  .then(() => {
    console.log("DB SUCCESS");
  })
  .catch(console.error);

// Passport Config
passportConfig();

// CORS ERROR solution

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // true로 해주어야 쿠키가 프론트로 전달된다
  })
);

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/ask", askRouter);

// 에러처리 미들웨어
// app.use((err, req, res, next) => {});

app.listen(8000, () => {
  console.log("Listening on PORT 8000...");
});
