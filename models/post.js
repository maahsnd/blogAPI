const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 30 },
  text: { type: String, required: true, mingLength: 100, maxLength: 10000 },
  date: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  published: { type: Boolean, default: false }
});

PostSchema.virtual('formatted_date').get(function () {
  return DateTime.fromJSDate(this.date).toISODate();
});

PostSchema.virtual('url').get(function () {
  return `/blog/posts/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);
