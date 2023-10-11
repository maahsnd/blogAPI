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
  try {
    console.log(req.params.id);
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
    console.log(blogPost);
    res.send(blogPost);
  } catch (error) {
    console.log(error);
  }
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
      res.status(400).send(errors);
      return;
    } else {
      await blogPost.save();
      res.send({ id: blogPost._id });
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
  // Validation middleware here...

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation Errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      // Fetch the existing post
      const post = await Post.findById(req.body._id);
      if (!post) {
        console.error('Post not found');
        return res.status(404).send('Post not found');
      }

      // Copy the comment IDs (if you intend to modify comments)
      const comments = post.comments.map((comment) => comment._id);

      // Create a new Post object with updated data
      const blogPost = new Post({
        title: req.body.title,
        text: req.body.text,
        date: post.date,
        user: req.body.user,
        comments: comments, // Optionally modify comments here
        _id: post._id,
        published: req.body.published // Update published status
      });

      // Update the existing post with the new data
      const updatedPost = await Post.findByIdAndUpdate(post._id, blogPost, {
        new: true // Return the updated post
      });

      res.json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  }
];
