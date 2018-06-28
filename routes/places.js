const express = require("express");
const passport = require('passport');
const placesRoutes = express.Router();
const Spot = require("../models/Spot");
const User = require("../models/User");


placesRoutes.get('/detail/:spotId',(req,res)=>{
  Spot.findById(req.params.spotId, function (err, spot) {
    console.log(spot);
    res.render('place-detail',{spot});
  });
})



placesRoutes.get('/add', (req,res)=>{
  res.render('auth/add-place');
});

placesRoutes.post('/add', (req, res, next) => {

  const {
    name,
    latitude,
    longitude
    
  } = req.body;
  // console.log("USER: ",res.locals.user);
  const newSpot = new Spot({
    name,
    coordinates: { latitude, longitude },
    _creator:res.locals.user._id
  });


  newSpot.save((err) => {
      if (err){ next(null, false, { message: newSpot.errors }) }
    //   return next(null, newPost);
  })
  .then(()=>{
    Spot.find({name:name})
    .then(spot=>{
      console.log(spot[0]._id);
      console.log(res.locals.user._id)
      User.findByIdAndUpdate(res.locals.user._id,{$push:{_addedSpots:spot[0]._id}}, (err,user)=>{
        if(err) console.log(err)
        console.log(user);
      }  )
    })
  })
  .then(()=>{
    res.redirect('/');
  })
});


placesRoutes.get('/edit',(req,res)=>{
  User.findById(res.locals.user._id).populate('_addedSpots')
  .then(spots=>{
    res.render('auth/edit-place-menu.hbs',{spots})

  })
});

placesRoutes.post('/edit',(req,res)=>{
  const {
    id
  } = req.body;
    res.redirect(`/places/edit/${id}`);
});



placesRoutes.get('/edit/:spotId', (req,res)=>{
  User.find({_addedSpots:req.params.spotId})
  .then(user=>{
    if(user.length){
      Spot.findById(req.params.spotId, function (err, spot) {
        console.log(spot);
        res.render('auth/edit-place',{spot});
      });
    } else {
      res.send('You can only change your spots, please! Dont try to edit random spot~')
    }
    
    
    // console.log("PLEASE!!",user)
  })
  
});

placesRoutes.post('/edit/:spotId', (req, res, next) => {

  const {
    name,
    latitude,
    longitude  
  } = req.body;

  Spot.findByIdAndUpdate(req.params.spotId,{name: name, coordinates:{latitude: latitude, longitude: longitude}}, (err,spot)=>{
    res.redirect('/');
  });  
});



module.exports = placesRoutes;