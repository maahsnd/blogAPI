/* const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
opts.jtwFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secret = process.env.SECRET;

module.exports = new jwtStrategy(async (opts, jwt_payload, done) => {
  let { username, password } = jwt_payload;
  const user = await User.findOne({
    user_name: username
  });
  if (!user) {
    return res.send('Username not found');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send('Incorrect password');
  }

  const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '120s' });
  return res.status(200).json({
    message: 'Auth passed',
    token
  });
});
 */
