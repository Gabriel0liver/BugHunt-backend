const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const reportSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true
  },
  chatId:{
    type: ObjectId,
    required: true
  }
});

const Report = mongoose.model('Report', reportSchema);
  
module.exports = Report;