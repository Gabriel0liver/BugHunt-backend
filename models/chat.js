const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const reportSchema = new Schema({
  devId: {
    type: ObjectId,
    required: true,
  },
  hackerId: {
    type: ObjectId,
    required: true
  }
});

const Report = mongoose.model('Report', reportSchema);
  
module.exports = Report;