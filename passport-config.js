const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      console.log(username, password);
      try {
        const user = await User.findOne({
          email: username
        });
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
