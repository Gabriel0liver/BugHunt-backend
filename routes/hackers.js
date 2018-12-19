const express = require('express');
const router = express.Router();

const Website = require('../models/website');
const Hacker = require('../models/hacker');
const Report = require('../models/report');

var nodemailer = require('nodemailer');
require('dotenv').config();

router.get('/',(req, res, next) => {

 
  

  if(!req.session.currentUser){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  if(req.session.currentUser.type === 'dev'){
    Hacker.find()
      .then(response => {
        const hackerList = response.map(hacker => {
          const {username, _id, points} = hacker
          return {
            username,
            _id,
            points
          }
        })
        res.json(hackerList);
      })
  }else{
    return res.status(401).json({
      error: 'unauthorized'
    });
  }
  
});


module.exports = router;