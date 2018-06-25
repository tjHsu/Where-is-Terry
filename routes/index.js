require('dotenv').config();
const express = require('express');
const router  = express.Router();
googleAPIKey = process.env.GOOGLE_API_KEY;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index',{googleAPIKey});
});




module.exports = router;
