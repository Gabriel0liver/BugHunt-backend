const express = require('express');
const router = express.Router();

const Chat = require('../models/chat');
const Hacker = require('../models/hacker');
const Dev = require('../models/dev');
const Report = require('../models/report');
const Message = require('../models/message')

const SocketManager = require("../SocketManager");



const mongoose = require('mongoose');

const { isLoggedIn } = require('../helpers/middlewares');

router.post('/:id', (req, res, next) => {
  const { message } = req.body

  Chat.find({ $and: [{ $or: [{devId: req.session.currentUser._id}, {hackerId: req.session.currentUser._id}]}, { _id: req.params.id}]})
    .then((chat) => {
      if(chat.length === 0 || chat === null){
        return res.status(401).json({
          error: 'no no no'
        });
      }else{
        const NewMessage = Message({
          text: message,
          user: req.session.currentUser.username,
          chatId: chat[0]._id,
          time: Date.now()
        })
        return NewMessage.save().then(() => {
          SocketManager.messageReceived(req.params.id)
          res.json(NewMessage);
        });
      }
    })
})

router.get('/:id', (req, res, next) => {
  
  Chat.find({ $and: [{ $or: [{devId: req.session.currentUser._id}, {hackerId: req.session.currentUser._id}]}, { _id: req.params.id}]})
    .then((chat) => {
      if(chat.length === 0 || chat === null){
        return res.status(401).json({
          error: 'no no no'
        });
      }else{
        Message.find({chatId: req.params.id})
          .then((messageArray)=>{
            let formatedMessages = []
            async function asyncFunc (callback) {
              for(let i = 0; i < messageArray.length; i++){
                let type = "dev"
                await Hacker.find({username: messageArray[i].user})
                  .then(hacker => {
                    if(hacker.type){
                      type = "hacker"
                    }
                  })
                formatedMessages.push({
                  username: messageArray[i].user,
                  time: messageArray[i].time,
                  text: messageArray[i].text,
                  type
                })
              }
              callback();
            }
            asyncFunc(()=>{
              res.json(formatedMessages)
              
            })
          })
      }
    })
})

router.post('/', (req, res, next) => {
  const { hackerId } = req.body

  if(req.session.currentUser.type !== 'dev'){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  Chat.find({hackerId})
    .then((response) => {
      if(response.length !== 0){
        return res.status(401).json({
          error: 'chat already started with user'
        });
      }else{
        Hacker.findById(hackerId)
          .then((hacker) => {
            if(hacker === null){
              return res.status(401).json({
                error: `hacker dosen't exist`
              });
            }
            const newChat = Chat({
              devId: req.session.currentUser._id,
              hackerId
            })
            return newChat.save().then(() => {
              res.json(newChat);
            });
          })
      }
    })
});

router.get('/',(req, res, next) => {  

});


module.exports = router;