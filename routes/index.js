// require('dotenv').config();
const express = require('express');
const router  = express.Router();
googleAPIKey = process.env.GOOGLE_API_KEY;
const Spot = require("../models/Spot");

/* GET home page */
router.get('/', (req, res, next) => {
  Spot.find()
  .then((spots)=> {
    res.render('index',{googleAPIKey : googleAPIKey, spots:spots });
  })
});

/* GET location page */
// router.get('/location', (req, res, next) => {
//   res.send("/location",req.query);
// });

router.get('/location', (req, res, next) => {
  console.log('DEBUG res.query',res.query);
  console.log('DEBUG req.query',req.query);

  let searchquery = res.query 
  res.render("location",searchquery)
});


// // our own "API" that gives acess to information stored into the database to the script  

// router.get('/api', (req, res, next) => {
// 	Spot.find((error, spots) => {
// 		if (error) { res.status(500).json({ error: error }) } 
// 		else { res.status(200).json({ spots, error: null })}
// 	})
// })

// router.get('/api/:id', (req, res, next) => {
// 	let spotId = req.params.id;
// 	Spot.findOne({_id: spotId}, (error, spot) => {
// 		if (error) { next(error) } 
// 		else { res.status(200).json({ spot }) }
// 	})
// })

// router.get('/api/:latitude/:longitude', (req, res, next) => {
// 	let spotLat = req.params.latitude;
// 	let spotLng = req.params.longitude;
// 	let spotLatMin = parseFloat(spotLat)-(0.025/2);
// 	let spotLatMax = parseFloat(spotLat)+(0.025/2);
// 	let spotLngMin = parseFloat(spotLng)-(0.029/2);
// 	let spotLngMax = parseFloat(spotLng)+(0.029/2);
// 	// console.log("DEBUG", spotLat, spotLng);
// 	// Spot.find((error, spots) => {
// 	// 	if (error) { next(error) } 
// 	// 	else { res.status(200).json({ spots })}
// 	// })


// 	Spot.find()
// 	.where('coordinates.latitude').gt(spotLatMin).lt(spotLatMax)
// 	.where('coordinates.longitude').gt(spotLngMin).lt(spotLngMax)
// 	.limit(10)
// 	.exec((error, spots) => {
// 		if (error) { next(error) } 
// 		else { res.status(200).json({ spots })}
// 	})
// })




module.exports = router;
