const passport = require("passport");
const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");
const dotenv = require("dotenv");
const { User } = require("../models");
dotenv.config();

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        //   });

        // Register User
        console.log(profile);
        cb(null, profile);
      }
    )
  );
};
