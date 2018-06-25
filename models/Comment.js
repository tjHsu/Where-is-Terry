const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const commentSchema = Schema({
  _creatorId:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }], 
  content: String,
  canBringYourOwn: Boolean,
  specialProperties:  { type: String, enum: ['Great view', 'Cool people', 'Too crowded']}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;