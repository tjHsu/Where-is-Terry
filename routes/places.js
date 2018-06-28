const express = require("express");
const passport = require('passport');
const addRoutes = express.Router();
const Spot = require("../models/Spot");



addRoutes.get('/add', (req,res)=>{
  res.render('auth/add-place');
});

addRoutes.post('/add', (req, res, next) => {

  const {
    name,
    latitude,
    longitude
    
  } = req.body;
//   const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  // const imagePath =  `/uploads/${req.file.filename}`
//   console.log(req.file);
  const newSpot = new Spot({
    name,
    latitude,
    longitude,
    _creator:req.user._id
  });


  newSpot.save((err) => {
      if (err){ next(null, false, { message: newSpot.errors }) }
    //   return next(null, newPost);
  })
  .then(()=>{
    res.redirect('/');
  })

  
});









module.exports = addRoutes;