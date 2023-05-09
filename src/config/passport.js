const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import * as model from "../models";
import { comparePasswordHash } from "../helpers";

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
  new LocalStrategy(async (email, password, cb) => {
    try {
      const user = await model.user.findOne({ where: { email } });
      if (!user) {
        throw new Error("Incorrect email");
      }
      const isPasswordValid = await comparePasswordHash(
        password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Incorrect password");
      }
      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
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
