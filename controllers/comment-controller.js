const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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

exports.get_comment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.body.id);
  comment ? res.send(comment) : res.status(404).send('Comment not found');
});

exports.edit_comment = [
  body('text')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Max comment length 500 char'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body);
    const editedComment = new Comment({
      text: req.body.text,
      date: req.body.date,
      user: req.body.user,
      post: req.body.post,
      _id: req.body._id
    });
    if (!errors.isEmpty()) {
      res.send(errors);
      return;
    } else {
      try {
        await editedComment.save();
        const comment = await Comment.findById(req.body._id);
        await Comment.findByIdAndUpdate(req.body._id, comment, {});
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

exports.delete_comment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.body.postid).populate('comments').exec();
  try {
    await Comment.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.error('Error deleting comment:' + error);
    res.send(error);
    return;
  }
  const commentIndex = post.comments.findIndex(
    (comment) => comment._id === req.params.id
  );
  if (commentIndex < 0) {
    console.error('Error getting comment index:' + error);
    res.send(error);
  }
  try {
    post.comments = post.comments.splice(commentIndex, 1);
    await Post.findByIdAndUpdate(req.body.postid, post, {});
  } catch (error) {
    console.error('Error updating post: ' + error);
    res.send(error);
    return;
  }
  res.send({ message: 'Comment deleted' });
});
