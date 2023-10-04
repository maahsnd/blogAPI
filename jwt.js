const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

exports.JwtStrategy = new jwtStrategy(opts, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
});
