const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const { text } = require('express');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: Text, required: true, maxLength: 20 },
  last_name: { type: Text, required: true, maxLength: 20 },
  user_name: { type: Text, required: true, maxLength: 20 },
  password: { type: Text, required: true, maxLength: 30 },
  email: { type: Text, required: true, maxLength: 30 },
  join_date: { type: Date, default: Date.now }
});

UserSchema.virtual('formatted_date').get(function () {
  return DateTime.fromJSDate(this.date).toISODate();
});

UserSchema.virtual('url').get(function () {
  return `/blog/users/${this._id}`;
});

UserSchema.virtual('full_name').get(function () {
  return `${this.first_name + this.last_name}`;
});

module.exports = mongoose.model('User', UserSchema);
