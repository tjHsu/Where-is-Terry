const express = require("express");
const passport = require('passport');
const placesRoutes = express.Router();
const Spot = require("../models/Spot");
const User = require("../models/User");
const Comment = require("../models/Comment");

placesRoutes.post('/add_favourite/:spotId', (req, res) => {
  User.findByIdAndUpdate(res.locals.user._id,{$addToSet:{_favouriteSpots:req.params.spotId}}, (err,user)=>{
    // console.log(user);
    if(err) console.log(err)
    res.redirect(`/places/detail/${req.params.spotId}`);
  })
});

placesRoutes.get('/detail/:spotId',(req,res)=>{
  Spot.findById(req.params.spotId).populate('_comments')
  .then(spot=>{
    res.render('place-detail',{spot});
  })
})

placesRoutes.post('/detail/:spotId', (req, res) => {

  const {
    content,
    canBringYourOwn
  } = req.body;
  // console.log("USER: ",res.locals.user);
  const newComment = new Comment({
    content,
    canBringYourOwn,    
    _creator:res.locals.user._id
  });


  newComment.save((err,comment) => {
      if (err){ next(null, false, { message: newComment.errors }) }
      return comment;
  })
  .then((comment)=>{
    // console.log("I did get comment after save", comment);
    // console.log("I did get comment id after save", comment._id);
    User.findByIdAndUpdate(res.locals.user._id,{$push:{_addedComments:comment._id}}, (err,user)=>{
      if(err) console.log(err)
    });
    Spot.findByIdAndUpdate(req.params.spotId,{$push:{_comments:comment._id}}, (err,spot)=>{
      if(err) console.log(err)
    });
  })
  .then(()=>{
    res.redirect(`/places/detail/${req.params.spotId}`);
  })
});

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
  User.findById(res.locals.user._id).populate('_addedSpots').populate('_favouriteSpots')
  .then(user=>{
    res.render('auth/edit-place-menu.hbs',{user})
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