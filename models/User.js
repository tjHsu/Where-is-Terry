const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username:{ type: String, unique: true },
  email: String,
  password: String,
  _addedSpots:[{
    type: Schema.Types.ObjectId,
    ref: 'Spot'
  }],
  _favouriteSpots:[{
    type: Schema.Types.ObjectId,
    ref: 'Spot'
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
