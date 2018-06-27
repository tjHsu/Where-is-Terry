// console.log("I got in interface")
// 52.598639, 13.258889 NW
// 52.430250, 13.255278 SW
// 52.346846, 13.553624 SE
// 52.592800, 13.494746 NE
// 52.346846, 13.255278 min 
// 52.598639, 13.553624 max

///danger////
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash = require("connect-flash");
const yelp = require('yelp-fusion');
const Spot = require('../models/Spot');

mongoose.Promise = Promise;
mongoose
  .connect("mongodb://localhost/where-is-terry", { useMongoClient: true })
  .then(() => {
    console.log('Connected to Mongo!')
  })
  .then(() => {
    Spot.collection.drop();
  })
  .then(() => {






    const yelpApiKey = process.env.YELP_API_KEY;
    const client = yelp.client(yelpApiKey);
    const latitudeMin = 52.346846;
    const latitudeMax = 52.598639;
    const latitudeDif = 0.0251793;// = (Max-Min)/10
    const longitudeMin = 13.255278;
    const longitudeMax = 13.553624;
    const longitudeDif = 0.0298346;// = (Max-Min)/10
    var accumulateDelay = 0;//avoid statusCode: 429 Too many request when accesing the Yelp DB
    var counter = 0;

    for (let k = latitudeMax; k > latitudeMin; k -= latitudeDif) {
      for (let l = longitudeMax; l > longitudeMin; l -= longitudeDif) {
        accumulateDelay += 500;
        setTimeout(()=> {

        counter += 1;
        console.log("Number of call: ", counter);

        latitudeString = k.toString();
        longitudeString = l.toString();
        var searchRequest = {
          term: 'Outdoor seating',
          latitude: latitudeString,//'52.28173',
          longitude: longitudeString//'13.19436'
          // coordinates: {latitude:'52.49894',longitude:'13.43071'}
          // location: 'Neukölln, Berlin'
        };
        // console.log(searchRequest.latitude,searchRequest.longitude);

        // console.log(searchRequest.latitude, searchRequest.longitude);

        client.search(searchRequest).then(response => {
          console.log(counter);
          for (let i = 0; i < response.jsonBody.businesses.length; i++) {
            // const element = array[i];
            const {
              id,
              alias,
              name,
              image_url,
              url,
              review_count,
              categories,
              rating,
              coordinates: { latitude, longitude },
              // geometry:{type:Point',coordinates[0]:longitude,co},
              // coordinates:{longitude},
              transactions,
              price,
              location:
              { address1,
                address2,
                address3,
                city,
                zip_code,
                country,
                state,
                display_address },
              phone,
              display_phone


            } = response.jsonBody.businesses[i];
            // console.log(response.jsonBody.businesses[i]);
            //   console.log(name);
            let coord = [longitude, latitude];
            console.log(coord)
            const newSpot = new Spot({
              yelpId: id,
              alias,
              name,
              image_url,
              url,
              review_count,
              categories,
              rating,
              // geometry: { type: 'Point', coordinates: coord },
              coordinates: { latitude, longitude },
              transactions,
              price,
              location:
                {
                  address1,
                  address2,
                  address3,
                  city,
                  zip_code,
                  country,
                  state,
                  display_address
                },
              phone,
              display_phone
            });
            console.log(newSpot);
            newSpot.save((err) => {
              if (err) console.log(err)//console.log("Some error happend when saving the data")//console.log(err);//{ next(null, false, { message: newSpot.errors }) }     
            });

          }
        }).catch(e => {
          console.log(e);
        });
        }, accumulateDelay);

      }
    }


  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });