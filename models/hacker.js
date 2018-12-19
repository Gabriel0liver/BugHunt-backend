const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hackerSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});

const Hacker = mongoose.model('Hacker', hackerSchema);
  
module.exports = Hacker;