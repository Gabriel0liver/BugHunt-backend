const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const devSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },type: {
    type: String,
    required: true
  }
});

const Dev = mongoose.model('Dev', devSchema);
  
module.exports = Dev;