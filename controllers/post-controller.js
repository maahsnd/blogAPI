const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

//Display list of all posts
exports.posts_get = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({ published: true })
    .populate('author')
    .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        populate: { path: 'user_name' }
      }
    })
    .sort({ date: -1 })
    .exec();
  res.render('posts_list', { title: 'All posts', posts: allPosts });
});
