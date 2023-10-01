const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const { text } = require('express');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: Text, required: true, minLength: 1, maxLength: 30 },
  text: { type: Text, required: true, mingLength: 100, maxLength: 10000 },
  date: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  published: { type: Booloean, default: false }
});

PostSchema.virtual('formatted_date').get(function () {
  return DateTime.fromJSDate(this.date).toISODate();
});

PostSchema.virtual('url').get(function () {
  return `/blog/posts/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);
