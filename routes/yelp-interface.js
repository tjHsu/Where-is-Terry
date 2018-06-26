// console.log("I got in interface")
// 52.598639, 13.258889 NW
// 52.430250, 13.255278 SW
// 52.346846, 13.553624 SE
// 52.592800, 13.494746 NE

// 52.346846, 13.255278 min 
// 52.598639, 13.553624 max
const express = require('express');
const yelpInterface = express.Router();
const yelp = require('yelp-fusion');
const Spot = require('../models/Spot');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const yelpApiKey = process.env.YELP_API_KEY
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
    accumulateDelay += 1000;
    setTimeout(function () {

      counter += 1;
      console.log("Number of call: ", counter);


      // console.log("This is a test: ",k,l);
      // sleep(1000);

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

      console.log(searchRequest.latitude, searchRequest.longitude);

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
          console.log(name);
          const newSpot = new Spot({
            yelpId: id,
            alias,
            name,
            image_url,
            url,
            review_count,
            categories,
            rating,
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

          newSpot.save((err) => {
            //if (err) console.log(err)//console.log("Some error happend when saving the data")//console.log(err);//{ next(null, false, { message: newSpot.errors }) }     
          });

        }
        // const firstResult = response.jsonBody.businesses[0];
        // const prettyJson = JSON.stringify(firstResult, null, 4);
        // console.log(prettyJson);
      }).catch(e => {
        console.log(e);
      });






    }, accumulateDelay);

  }
}


function saveYelpData(term) {
  client.search(searchRequest).then(response => {
    for (let i = 0; i < response.jsonBody.businesses.length; i++) {
      // const element = array[i];
      console.log(i);
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
      console.log(name);
      const newSpot = new Spot({
        yelpId: id,
        alias,
        name,
        image_url,
        url,
        review_count,
        categories,
        rating,
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

      newSpot.save((err) => {
        //if (err) console.log(err)//console.log("Some error happend when saving the data")//console.log(err);//{ next(null, false, { message: newSpot.errors }) }     
      });

    }
    // const firstResult = response.jsonBody.businesses[0];
    // const prettyJson = JSON.stringify(firstResult, null, 4);
    // console.log(prettyJson);
  }).catch(e => {
    console.log(e);
  });

  return 0;     // The function returns the product of p1 and p2
}
















module.exports = yelpInterface;
