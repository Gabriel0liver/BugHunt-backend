const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const reportSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  hacker:{
    type: ObjectId,
    required: true
  },
  website:{
    type: ObjectId,
    required: true
  },
  status:{
    type: String,
    required: true
  },
  comment:{
    type: String
  },
  points:{
    type: Number,
    required: true
  }
});

const Report = mongoose.model('Report', reportSchema);
  
module.exports = Report;