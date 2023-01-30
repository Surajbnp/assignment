const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
const passport = require("passport");

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      // });
      const user = {
        email: profile.email,
        name: profile.displayName,
      };
       done(null, user);
    }
  )
);

module.exports = passport;
