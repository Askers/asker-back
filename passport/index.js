const passport = require("passport");
const local = require("./local");
const twitter = require("./twitter");
const google = require("./google");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 다 들고 있으면 무거우니까
    console.log("serialize User");
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      console.log("deserialize User");
      console.log(user);
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
  google();
  twitter();
};
