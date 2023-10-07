const Post = require('../models/post');
const User = require('../models/user');
const Comments = require('../models/comment');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.send('render user sign-up form');
});

exports.sign_up_post = [
  body('first_name')
    .trim()
    .isLength({ max: 20 })
    .withMessage('First name not to exceed 20 char')
    .isLength({ min: 1 })
    .withMessage('first name required')
    .escape(),
  body('last_name')
    .trim()
    .isLength({ max: 20 })
    .withMessage('Last name not to exceed 20 char')
    .isLength({ min: 1 })
    .withMessage('last name required')
    .escape(),
  body('user_name')
    .trim()
    .isLength({ max: 20 })
    .withMessage('User name not to exceed 20 char')
    .isLength({ min: 1 })
    .withMessage('user name required')
    .custom(async (value) => {
      const username = await User.find({ user_name: value });
      if (username) {
        return false;
      }
      return true;
    })
    .escape(),
  body('password')
    .trim()
    .custom((value) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
      if (passwordRegex.test(value)) {
        return true;
      }
      return false;
    })
    .withMessage(
      'Password must be min 8 characters, contain a lower case, upper case, number, and special character.'
    )
    .escape(),
  body('confirm_password')
    .trim()
    .custom((value, { req }) => {
      return req.body.password === value;
    })
    .withMessage('Passwords do not match'),
  body('email')
    .isEmail()
    .withMessage('Must be valid email')
    .trim()
    .custom(async (value) => {
      const email = await User.find({ email: value });
      if (email) {
        return false;
      } else {
        return true;
      }
    })
    .withMessage('E-mail already in use')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      user_name: req.body.user_name,
      password: req.body.password,
      email: req.body.email
    });

    if (!errors.isEmpty()) {
      res.send(errors.array());
      return;
    } else {
      bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
        user.password = hashedPassword;
        await user.save();
      });
    }
  })
];

exports.log_in_get = asyncHandler(async (req, res, next) => {
  res.send('Render log in form');
});

exports.log_in_post = asyncHandler(async (req, res, next) => {
  let { username, password } = req.body;
  const user = await User.findOne({
    user_name: username
  });
  if (!user) {
    return res.status(401).json({
      message: 'Username not found'
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '1hr' });
  return res.status(200).json({
    message: 'Auth passed',
    token,
    user
  });
});

exports.logout_post = function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.send('Logged out');
  });
};
