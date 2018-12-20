const express = require('express');
const router = express.Router();

const Chat = require('../models/chat');
const Hacker = require('../models/hacker');
const Dev = require('../models/dev');
const Report = require('../models/report');
const Message = require('../models/message')

const SocketManager = require("../SocketManager");

var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: process.env.GMAIL,
         pass: process.env.PASSWORD
     }
 });

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
          const sendMessage={
            username: NewMessage.user,
            time: NewMessage.time,
            text: NewMessage.text,
            type: NewMessage.type
          }
          res.json(sendMessage);
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
                    if(hacker[0]){
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

  Chat.find({ $and: [{hackerId},{devId: req.session.currentUser._id}]})
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
            const mailOptions = {
              from: 'bug-hunt-notifications@gmail.com', // sender address
              to: hacker.email, // list of receivers
              subject: 'A chat has been open with you', // Subject line
              html: `<h4>The developer ${req.session.currentUser.username} has opened a chat with you.</h4>
              <h4>Go to https://bug-hunt-website.firebaseapp.com/chats to chat with the dev. </h4>`// plain text body
            };
            transporter.sendMail(mailOptions, function (err, info) {if(err){console.log(err)}});
            return newChat.save().then(() => {
              res.json(newChat._id);
              SocketManager.messageReceived(newChat._id)
            });
          })
      }
    })
});

router.get('/',(req, res, next) => {  
  Chat.find({ $or: [{devId: req.session.currentUser._id}, {hackerId: req.session.currentUser._id}]})
    .then((chatList) => {
      let formatedChats = []
            async function asyncFunc (callback) {
              for(let i = 0; i < chatList.length; i++){
                let username = '';
                if(req.session.currentUser.type==='dev'){
                  await Hacker.findById(chatList[i].hackerId)
                  .then(hacker => {
                    username = hacker.username
                  })
                }else{
                  await Dev.findById(chatList[i].devId)
                  .then(dev => {
                    username = dev.username
                  })
                }
                
                formatedChats.push({
                  id: chatList[i]._id,
                  username
                })
              }
              callback();
            }
            asyncFunc(()=>{
              res.json(formatedChats)
            })
    })
});

module.exports = router;