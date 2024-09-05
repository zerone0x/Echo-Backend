const passport = require("passport");
const GoogleStragegy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStragegy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://echoloop.vercel.app/api/v1/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      // it will execute before redirect
      try {
        let currUser = await User.findOne({ googleId: profile.id });

        if (currUser) {
          return done(null, currUser);
        }

        const index = profile.displayName.indexOf("(");
        const username =
          index !== -1
            ? profile.displayName.slice(0, index).replace(/\s+/g, "")
            : profile.displayName.replace(/\s+/g, "");

        console.log(profile);

        currUser = await User.create({
          googleId: profile.id,
          name: username,
          email: profile.emails[0].value,
        });

        done(null, currUser);
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    },
  ),
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://echoloop.vercel.app/api/v1/auth/github/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      // it will execute before redirect
      try {
        let currUser = await User.findOne({ githubId: profile.id });

        if (currUser) {
          return done(null, currUser);
        }

        currUser = await User.create({
          githubId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });

        done(null, currUser);
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    },
  ),
);
