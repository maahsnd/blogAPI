#! /usr/bin/env node
const dotenv = require('dotenv').config();
const Comment = require('./models/comment');
const Post = require('./models/post');
const User = require('./models/user');

const mongoDB = process.env.MONGO;

const comments = [];
const posts = [];
const users = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createUsers();
  await createPosts();
  await createComments();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function userCreate(
  index,
  first_name,
  last_name,
  user_name,
  password,
  email
) {
  const userDetail = {
    first_name: first_name,
    last_name: last_name,
    user_name: user_name,
    password: password,
    email: email
  };
  const user = new User(userDetail);
  await user.save();
  users[index] = user;
  console.log(`Added user: ${user}`);
}

async function postCreate(index, title, text, user) {
  const postDetail = {
    title: title,
    text: text,
    user: user,
    published: true
  };

  const post = new Post(postDetail);
  await post.save();
  posts[index] = post;
  console.log(`Added post: ${post}`);
}

async function commentCreate(index, text, user, post) {
  const commentDetail = {
    text: text,
    user: user,
    post: post
  };

  const comment = new Comment(commentDetail);

  await comment.save();
  post.comments[index] = comment;
  const updatedPost = await Post.findByIdAndUpdate(post._id, post, {});
  await updatedPost.save();

  console.log(`Added comment: ${comment}`);
}

async function createUsers() {
  console.log('Adding users');
  await Promise.all([
    userCreate(0, 'Nick', 'M', 'nickm', 'password', 'email@email.com'),
    userCreate(1, 'Diego', 'M', 'diegom', 'password1', 'email1@email1.com')
  ]);
}

async function createPosts() {
  console.log('Adding posts');
  await Promise.all([
    postCreate(0, 'Test', 'testtexttesttexttesttexttesttext', users[0]),
    postCreate(1, 'Test1', '1testtexttesttexttesttexttesttext', users[0])
  ]);
}

async function createComments() {
  console.log('Adding comments');
  await Promise.all([
    commentCreate(0, 'testcomment', users[1], posts[0]),
    commentCreate(1, '1testcomment', users[0], posts[0])
  ]);
}
