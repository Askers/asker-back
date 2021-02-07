const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const askRouter = require("./routes/ask");
const userRouter = require("./routes/ask");
const db = require("./models");
const { urlencoded } = require("express");

const passportConfig = require("./passport");
dotenv.config();
const app = express();

// DB 연결
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
    origin: "*",
    credentials: false, // 나중에 true로 바꿔야 함
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
app.get("/", (req, res) => {
  res.send("hello home");
});

app.use("/ask", askRouter);
app.use("/user", userRouter);

app.listen(3065, () => {
  console.log("Listening on PORT 3065...");
});
