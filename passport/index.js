const passport = require("passport");
const local = require("./local");
const twitter = require("./twitter");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 다 들고 있으면 무거우니까
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
  twitter();
};
