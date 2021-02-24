const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const { User } = require("../models");
dotenv.config();

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: { googleId: profile.id },
          });
          if (!exUser) {
            // Create New User
            const user = await User.create({
              googleId: profile.id,
              username: profile.name.givenName,
              profileImgUrl: profile._json.picture,
              provider: "google",
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
