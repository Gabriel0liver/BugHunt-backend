const express = require('express');
const router = express.Router();

const Website = require('../models/website');
const Hacker = require('../models/hacker');
const Chat = require('../models/chat');

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
        const hackerList = [] 
        async function asyncFunc(callback) {
          for(let i = 0; i < response.length; i++){
            await Chat.findOne({ $and:[{hackerId: response[i]},{devId: req.session.currentUser._id}]})
              .then((chat) => {
                if(!chat){
                  const {username, _id, points} = response[i]
                  hackerList.push({
                    username,
                    _id,
                    points
                  })
                }
              })
            
          }
          callback()
        }
        asyncFunc(()=>{
          res.json(hackerList);
        })
      })
  }else{
    return res.status(401).json({
      error: 'unauthorized'
    });
  }
  
});


module.exports = router;