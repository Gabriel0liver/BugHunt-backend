const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
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
  },
  time: {
    type: Number,
    required: true
  }
});

const Message = mongoose.model('Message', messageSchema);
  
module.exports = Message;