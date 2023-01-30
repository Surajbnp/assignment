const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
const passport = require("passport");
const UserModel = require("../models/UserModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      // });

      const user = {
        email: profile.email,
        name: profile.displayName,
        user_id: profile.id,
        picture: profile.picture,
      };
      let isRegd = await UserModel.findOne({ email: profile.email });
      if (isRegd) {
      } else {
        let data = new UserModel(user)
        await data.save();
      }
      done(null, user);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

module.exports = passport;
