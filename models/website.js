const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const websiteSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: ObjectId,
    required: true
  }
});

const Website = mongoose.model('Website', websiteSchema);
  
module.exports = Website;