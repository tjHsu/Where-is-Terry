const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spotSchema = new Schema({
  yelpId: String,
  alias: String,
  name: { type: String, unique: true },
  image_url: String,
  url: String,
  review_count: Number,
  categories: [],
  rating: Number,
  // geometry: { type: {type: String}, coordinates: [ Number] },
  coordinates: { latitude: Number, longitude: Number },
  transactions: [],
  price: String,
  location:
    {
      address1: String,
      address2: String,
      address3: String,
      city: String,
      zip_code: String,
      country: String,
      state: String,
      display_address: []
    },
  phone: String,
  display_phone: String,


  _comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],


  _creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
// spotSchema.index({ location: '2dsphere' });

const Spot = mongoose.model('Spot', spotSchema);
module.exports = Spot;
