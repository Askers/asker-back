const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 다 들고 있으면 무거우니까
    done(user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      await User.findOne({ where: { id } });
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
