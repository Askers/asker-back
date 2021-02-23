const passport = require("passport");
const { Strategy: TwitterStrategy } = require("passport-twitter");
const dotenv = require("dotenv");
const { User } = require("../models");
dotenv.config();

module.exports = () => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
      },
      async (token, tokenSecret, profile, cb) => {
        try {
          const exUser = await User.findOne({
            where: { email: profile.emails[0].value },
          });
          if (exUser) {
            cb(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile.emails[0].value,
              username: profile.displayName,
              provider: "twitter",
            });
            cb(null, newUser);
          }
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
