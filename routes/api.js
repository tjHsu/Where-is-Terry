const express = require('express');
const Spot = require("../models/Spot");

const apiRoutes = express.Router();

// our own "API" that gives acess to information stored into the database to the script  

apiRoutes.get('/spots', (req, res, next) => {
	Spot.find((error, spots) => {
		if (error) { res.status(500).json({ error: error }) } 
		else { res.status(200).json({ spots, error: null })}
	})
})

apiRoutes.get('/spots/:id', (req, res, next) => {
	let spotId = req.params.id;
	Spot.findOne({_id: spotId}, (error, spot) => {
		if (error) { next(error) } 
		else { res.status(200).json({ spot }) }
	})
})

apiRoutes.get('/spots/:latitude/:longitude', (req, res, next) => {
	let spotLat = req.params.latitude;
	let spotLng = req.params.longitude;
	let spotLatMin = parseFloat(spotLat)-(0.025/2);
	let spotLatMax = parseFloat(spotLat)+(0.025/2);
	let spotLngMin = parseFloat(spotLng)-(0.029/2);
	let spotLngMax = parseFloat(spotLng)+(0.029/2);
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

module.exports = apiRoutes;