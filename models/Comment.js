const mongoose = require('mongoose');
const specialProperties = require("../enums/specialProperties.json")
const Schema   = mongoose.Schema;

const commentSchema = Schema({
  _creator:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }, 
  content: String,
  canBringYourOwn: Boolean,
  specialProperties:  { type: String, enum: specialProperties}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;