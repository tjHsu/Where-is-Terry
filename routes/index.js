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

// our own "API" that gives acess to information stored into the database to the script  

router.get('/api', (req, res, next) => {
	Spot.find((error, spots) => {
		if (error) { next(error) } 
		else { res.status(200).json({ spots })}
	})
})

router.get('/api/:id', (req, res, next) => {
	let spotId = req.params.id;
	Spot.findOne({_id: spotId}, (error, spot) => {
		if (error) { next(error) } 
		else { res.status(200).json({ spot }) }
	})
})

router.get('/api/:latitude/:longitude', (req, res, next) => {
	let spotLat = req.params.latitude;
	let spotLng = req.params.longitude;
	let spotLatMin = parseFloat(spotLat)-0.025;
	let spotLatMax = parseFloat(spotLat)+0.025;
	let spotLngMin = parseFloat(spotLng)-0.029;
	let spotLngMax = parseFloat(spotLng)+0.029;
	// console.log("DEBUG", spotLat, spotLng);
	// Spot.find((error, spots) => {
	// 	if (error) { next(error) } 
	// 	else { res.status(200).json({ spots })}
	// })


	Spot.find()
	.where('coordinates.latitude').gt(spotLatMin).lt(spotLatMax)
	.where('coordinates.longitude').gt(spotLngMin).lt(spotLngMax)
	.limit(10)
	.exec((error, spots) => {
		if (error) { next(error) } 
		else { res.status(200).json({ spots })}
	})
})




module.exports = router;
