const express = require("express");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
require('./config/googleAuth')
const passport = require("passport");
const connection = require("./config/db");
const isLoggedIn = require("./middlewares/authenticator");
const session = require("express-session");

const app = express();
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send(`<a href='/auth/google'>Login with Google</a>`);
});

app.get("/create", isLoggedIn, (req, res) => {
    console.log(req.user)
  res.send(`<h3> Hello ${req.user.name}</h3> <img src=${req.user.picture} /> <a href='/logout'>Logout</a> `);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/create",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res, next) => {
  res.send("loging failed");
});

app.get("/logout", (req, res) => {
  req.logout;
  req.session.destroy();
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
