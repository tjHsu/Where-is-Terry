// require('dotenv').config();
const express = require('express');
const router  = express.Router();
googleAPIKey = process.env.GOOGLE_API_KEY;

//fake spots that will later be created based on user behavior

let spot1 = {
  name: "In front of MTV office",
  coordinates: {
    latitude: 52.50012,
    longitude: 13.453469
  },
  description: "beautiful view of the spree river", 
};

let spot2 = {
  name: "Oberbaumbrücke",
  coordinates: {
    latitude: 52.501982,
    longitude: 13.445887
  },
  description: "live music", 
};

let spots = [spot1,spot2];

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index',{googleAPIKey : googleAPIKey, spots:spots });
});




module.exports = router;
