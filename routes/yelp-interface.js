// console.log("I got in interface")
const express = require('express');
const yelpInterface  = express.Router();
const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = 'FQcasLRJqAsLjC5YJi24r0FeQyYb5w1HMDCweg5WVLwYnj0naSoRQnfroIGSt5qCAT0-2nQSJtiGjd5KGIKW-1rnPs7ddsv76AKH_3m_G6V7tP8el85n3yMkZKUwW3Yx';

const searchRequest = {
  term:'Four Barrel Coffee',
  location: 'san francisco, ca'
};

const client = yelp.client(apiKey);

client.search(searchRequest).then(response => {
  const firstResult = response.jsonBody.businesses[0];
  const prettyJson = JSON.stringify(firstResult, null, 4);
  console.log(prettyJson);
}).catch(e => {
  console.log(e);
});

module.exports = yelpInterface;
