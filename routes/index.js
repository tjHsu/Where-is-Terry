// require('dotenv').config();
const express = require("express");
const router = express.Router();
googleAPIKey = process.env.GOOGLE_API_KEY;
const Spot = require("../models/Spot");

/* GET home page */
router.get("/", (req, res, next) => {
  Spot.find().then(spots => {
    res.render("index", { googleAPIKey: googleAPIKey, spots: spots });
  });
});

router.get("/location", (req, res, next) => {
  // console.log('DEBUG res.query',res.query);
  console.log("DEBUG req.query", req.query);

  let locationCoordinates = req.query;

  console.log("locationCoordinates.latitude", locationCoordinates.latitude);
  //use the cooridnates to fetch 10 spots and pass them to the views

  let spotLat = locationCoordinates.latitude;
  let spotLng = locationCoordinates.longitude;
  let spotLatMin = parseFloat(spotLat) - 0.025 / 2;
  let spotLatMax = parseFloat(spotLat) + 0.025 / 2;
  let spotLngMin = parseFloat(spotLng) - 0.029 / 2;
  let spotLngMax = parseFloat(spotLng) + 0.029 / 2;

  Spot.find()
    .where("coordinates.latitude")
    .gt(spotLatMin)
    .lt(spotLatMax)
    .where("coordinates.longitude")
    .gt(spotLngMin)
    .lt(spotLngMax)
    .limit(10)
    .exec((error, spots) => {
      if (error) {
        next(error);
      } else {
        res.render("index",  { googleAPIKey: googleAPIKey, spots: spots, spotLat:spotLat, spotLng:spotLng } );
      }
    });
});

module.exports = router;
