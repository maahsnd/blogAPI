const Post = require('../models/post');
const User = require('../models/user');
const Comments = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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
  jwt.verify(req.token, process.env.SECRET, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        data
      });
    }
  });
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

exports.blogpost_edit_get = asyncHandler(async (req, res, next) => {
  res.send('blogpost edit get');
});

//to do
exports.blogpost_edit_post = asyncHandler(async (req, res, next) => {});
