const express = require("express");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
const passport = require("passport");
const connection = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(passport.initialize());
// app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/create", (req, res) => {
  res.send("create an event now");
});

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

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    session: false,
  }),
  (req, res, next) => {
    console.log(req.user, req.isAuthenticated());
    res.redirect("/create");
  }
);

app.get("/auth/failure", (req, res, next) => {
  res.send("loging failed");
});

app.get("/logout", (req, res) => {
  req.logout;
  console.log(req.isAuthenticated());
  res.redirect("/");
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("conneted to the db");
  } catch (err) {
    console.log(err);
  }
  console.log(`server is running on ${PORT}`);
});
