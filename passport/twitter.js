const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const dotenv = require("dotenv");
const { User } = require("../models");
dotenv.config();

module.exports = () => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_KEY_SECRET,
        callbackURL: "/auth/twitter/callback",
      },
      async (token, tokenSecret, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: { socialKey: profile.id },
          });
          // Create New User
          if (!exUser) {
            const user = await User.create({
              socialKey: profile.id,
              username: profile.username,
              provider: "twitter",
            });
            return done(null, user);
          }
          done(null, exUser);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );
};
