const express = require('express');
const router = express.Router();

const Hacker = require('../models/hacker');
const Dev = require('../models/dev');
const Report = require('../models/report');

const { isLoggedIn } = require('../helpers/middlewares');


router.post('/', (req, res, next) => {
  const {
    title,
    dev,
    description
  } = req.body;

  if(!req.session.currentUser){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  console.log(req.body)

  Dev.findOne({username: dev})
    .then((response) => {
      if(!response){
        
      }

      const newReport = Report({
        title,
        description,
        developer: response._id,
        hacker: req.session.currentUser._id
      })

      return newReport.save().then(() => {
        res.json(newReport);
      });
    })
    .catch(error => {console.log(error)});

  
});


module.exports = router;
