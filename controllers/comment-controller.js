const Post = require('../models/post');
const Comment = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
  const comment = await Comment.findById(req.params.id);
  comment ? res.send(comment) : res.status(404).send('Comment not found');
});

exports.edit_comment = [
  body('text')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Max comment length 500 char'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(errors);
      return;
    } else {
      try {
        const comment = await Comment.findById(req.params.id);
        const editedComment = new Comment({
          text: req.body.text,
          date: req.body.date,
          user: req.body.user,
          post: req.body.post,
          _id: req.body._id
        });
        await Comment.findByIdAndUpdate(req.body._id, editedComment, {});
      } catch (err) {
        console.log('error: ' + err);
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
  console.log(post.comments);
  const commentIndex = post.comments.findIndex(
    (comment) => comment._id == req.params.id
  );
  if (commentIndex < 0) {
    console.error('comment index not found');
    return;
  }
  try {
    post.comments.splice(commentIndex, 1);
    await Post.findByIdAndUpdate(req.body.postid, post, {});
  } catch (error) {
    console.error('Error updating post: ' + error);
    res.send(error);
    return;
  }

  try {
    await Comment.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.error('Error deleting comment:' + error);
    res.send(error);
    return;
  }

  res.send({ message: 'Comment deleted' });
});
