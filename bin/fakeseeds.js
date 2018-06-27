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
const yelpApiKey = process.env.YELP_API_KEY;
const client = yelp.client(yelpApiKey);




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
        ///////test///////////
        // for (let i = 0; i < 1; i++){
        // for (let j = 0; j < 1; j++) {

        var searchRequest = {
            term: 'Outdoor seating',
            latitude: '52.28173',
            longitude: '13.19436'
            // coordinates: {latitude:'52.49894',longitude:'13.43071'}
            // location: 'Neukölln, Berlin'
        };
        // console.log(searchRequest.latitude,searchRequest.longitude);

        // console.log(searchRequest.latitude, searchRequest.longitude);
        
        client.search(searchRequest).then(response => {
            // console.log(counter);
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
                    geometry: { type: 'Point', coordinates: coord },
                    // coordinates: { latitude, longitude },
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


        //         let coord = [22, -90];
        //   console.log(coord)
        //   const newSpot = new Spot({
        //     yelpId: '321321321',
        //     alias: 'TEST',
        //     name: 'TEST',
        //     image_url:'TEST',
        //     url:'TEST',
        //     review_count:42,
        //     categories:['TEST'],
        //     rating:42,
        //     geometry:{type:'Point',coordinates: coord},
        //     // coordinates: { latitude, longitude },
        //     transactions: ['TEST'],
        //     price:'TEST',
        //     location:
        //       {
        //         address1:'Linienstr. 40',
        //         address2:'',
        //         address3:'',
        //         city:'Berlin',
        //         zip_code:'10119',
        //         country:'DE',
        //         state:'BE',
        //         display_address:[ 'Linienstr. 40', '10119 Berlin', 'Germany' ]
        //       },
        //     phone:'TEST',
        //     display_phone:'TEST'
        //   });
        //   console.log(newSpot)
        //   newSpot.save((err) => {

        //     if (err) console.log(err)//console.log("Some error happend when saving the data")//console.log(err);//{ next(null, false, { message: newSpot.errors }) }     
        //   });


        // }
        // }


        ////////////
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });