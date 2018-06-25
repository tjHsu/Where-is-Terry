const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const spotSchema = new Schema({
  yelpId: String,
alias: String,
name:{ type: String, unique: true },
image_url:String,
url: String,
review_count: Number,
categories: [],
rating: Number,
coordinates: { latitude: Number, longitude: Number },
transactions: [],
price: String,
location: 
     { address1: String,
       address2: String,
       address3: String,
       city: String,
       zip_code: String,
       country: String,
       state: String,
       display_address: [] },
phone: String,
display_phone: String,


_comments:[{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],


_creator:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Spot = mongoose.model('Spot', spotSchema);
module.exports = Spot;


    // id: 'Rxv3LmNv7C5JKwyL2wU8zw',
    // alias: 'lanzano-berlin',
    // name: 'Lanzano',
    // image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/h9CLFSPIdbdeDJYl69OVfw/o.jpg',
    // is_closed: false,
    // url: 'https://www.yelp.com/biz/lanzano-berlin?adjust_creative=qhkZfCKr7xaOEudr90SM3w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=qhkZfCKr7xaOEudr90SM3w',
    // review_count: 3,
    // categories: [ [Object] ],
    // rating: 3.5,
    // coordinates: { latitude: 52.4998099, longitude: 13.43291 },
    // transactions: [],
    // price: '€€',
    // location: 
    //  { address1: 'Skalitzer Str. 94 a',
    //    address2: null,
    //    address3: null,
    //    city: 'Berlin',
    //    zip_code: '10997',
    //    country: 'DE',
    //    state: 'BE',
    //    display_address: [Array] },
    // phone: '+49306869534',
    // display_phone: '+49 30 6869534',
    // distance: 2703.8686406170564 } 