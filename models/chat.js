const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const chatSchema = new Schema({
  devId: {
    type: ObjectId,
    required: true,
  },
  hackerId: {
    type: ObjectId,
    required: true
  }
});

const Chat = mongoose.model('Chat', chatSchema);
  
module.exports = Chat;