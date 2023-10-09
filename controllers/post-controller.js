const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//Display list of all blog posts
exports.all_blogposts_get = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
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
  res.json({
    user: req.user,
    token: req.headers.authorization
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
  res.json({
    user: req.user,
    token: req.headers.authorization
  });
});

exports.blogpost_edit_post = [
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
    const post = await Post.findById(req.params.id);

    const blogPost = new Post({
      title: req.body.title,
      text: req.body.text,
      date: post.date,
      user: req.body.user,
      comments: req.body.comments,
      _id: post._id
    });

    req.body.published
      ? (blogPost.published = true)
      : (blogPost.published = false);

    if (!errors.isEmpty()) {
      res.send(errors);
      return;
    } else {
      blogPost._id = postId._id;
      await Post.findByIdAndUpdate(req.params.id, blogPost, {});

      res.send('Successfully created post: ' + blogPost);
    }
  })
];

exports.new_comment = [
  body('text')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Max comment length 500 char'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const newComment = new Comment({
      text: req.body.text,
      user: req.body.userId,
      post: req.body.postId
    });

    if (!errors.isEmpty()) {
      res.send(errors);
      return;
    } else {
      try {
        await newComment.save();
        const post = await Post.findById(req.body.postId);
        console.log(post);
        post.comments.push(newComment);
        await Post.findByIdAndUpdate(req.body.postId, post, {});
      } catch (err) {
        console.log('save error: ' + err);
      }

      res.json({
        user: req.user,
        token: req.headers.authorization
      });
    }
  })
];
