const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true, maxLength: 500 },
  date: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
});

CommentSchema.virtual('formatted_date').get(function () {
  return DateTime.fromJSDate(this.date).toISODate();
});

CommentSchema.virtual('url').get(function () {
  return `/blog/posts/:postId/${this._id}`;
});

module.exports = mongoose.model('Comment', CommentSchema);
