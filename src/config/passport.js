const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models";

// Set up the Google OAuth2 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1036345270095-4tn6uso6ufpbglsfinp5084v5p42vbdl.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    (payload, done) => {
      if (payload) {
        return done(null, payload);
      } else {
        return done(null, false);
      }
    }
  )
);
