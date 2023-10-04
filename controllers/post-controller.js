const Post = require('../models/post');
const User = require('../models/user');
const Comments = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

//Display list of all blog posts
exports.all_blogposts_get = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({ published: true })
    .populate('user')
    .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        populate: { path: 'user_name' }
      }
    })
    .sort({ date: -1 })
    .exec();
  res.send(allPosts);
});

exports.blogpost_get = asyncHandler(async (req, res, next) => {
  const blogPost = await Post.findById(req.params.id)
    .populate('comments')
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        populate: { path: 'user_name' }
      }
    })
    .exec();
  if (!blogPost.published) {
    throw new Error('post not published');
  }
  res.send(blogPost);
});

exports.new_blogpost_get = asyncHandler(async (req, res, next) => {
  res.send('render form to create new blog post');
});

exports.new_blogpost_post = [
  body('title')
    .trim()
    .isLength({ max: 30 })
    .withMessage('Exceeds max length of 30')
    .escape(),
  body('text')
    .trim()
    .isLength({ min: 100, max: 10000 })
    .withMessage('Text must be between 100 and 10,000 char')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const blogPost = new Post({
      title: req.body.title,
      text: req.body.text,
      user: req.body.user
    });

    if (req.body.published) {
      blogPost.published = true;
    }

    if (!errors.isEmpty()) {
      res.send(errors);
      return;
    } else {
      await blogPost.save();

      res.send('Successfully created post: ' + blogPost);
    }
  })
];

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.send('render user sign-up form');
});

exports.sign_up_post = [
  body('first_name')
    .trim()
    .isLength({ max: 20 })
    .withMessage('First name not to exceed 20 char')
    .escape(),
  body('last_name')
    .trim()
    .isLength({ max: 20 })
    .withMessage('Last name not to exceed 20 char')
    .escape(),
  body('user_name')
    .trim()
    .isLength({ max: 20 })
    .withMessage('User name not to exceed 20 char')
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
      res.send(`user ${user.full_name} logged in successfully`);
    }
  })
];

exports.log_in_get = asyncHandler(async (req, res, next) => {});

exports.log_in_post = asyncHandler(async (req, res, next) => {});

exports.blogpost_edit_get = asyncHandler(async (req, res, next) => {});
