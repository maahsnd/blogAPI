const Post = require('../models/post');
const User = require('../models/user');
const Comments = require('../models/comment');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

//Display list of all posts
exports.all_posts_get = asyncHandler(async (req, res, next) => {
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
  res.render('posts_list', { title: 'All posts', posts: allPosts });
});
