const express = require('express');
const router = express.Router();

const Chat = require('../models/chat');
const Dev = require('../models/dev');
const Report = require('../models/report');

const mongoose = require('mongoose');

const { isLoggedIn } = require('../helpers/middlewares');

router.get('/:id', (req, res, next) => {

})

router.delete('/:id', (req, res, next) => {

})

router.post('/', (req, res, next) => {
  const { hackerId } = req.body

  if(req.session.currentUser !== 'dev'){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  Chat.find({hackerId})
    .then((response) => {
      if(response){
        return res.status(401).json({
          error: 'chat already started with user'
        });
      }
    })


});

router.get('/',(req, res, next) => {  

});


module.exports = router;
