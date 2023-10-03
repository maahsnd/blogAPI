const Post = require('../models/post');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

//Display list of all posts
exports.posts_get = asyncHandler(async (req, res, next) => {
  console.log('7');
  const allPosts = await Post.find({ published: true })
    .populate('user')
    /*  .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        populate: { path: 'user_name' }
      }
    }) */
    .sort({ date: -1 })
    .exec();
  console.log('posts:' + allPosts[0]);
  res.render('posts_list', { title: 'All posts', posts: allPosts });
});
