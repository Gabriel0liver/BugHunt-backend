const express = require('express');
const router = express.Router();

const Website = require('../models/website');
const Dev = require('../models/dev');
const Report = require('../models/report');

const mongoose = require('mongoose');

const { isLoggedIn } = require('../helpers/middlewares');

router.get('/:id', (req, res, next) => {

  if(!req.session.currentUser){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  Report.findById(req.params.id)
    .then(response => {
      if(response.hacker == req.session.currentUser._id || response.developer == req.session.currentUser._id){
        const report = {
          title: response.title,
          description: response.description
        }
        return res.json(report)
      }
      return res.status(401).json({
        error: 'unauthorized'
      });
    })
    .catch(error => {console.log(error)});

})

router.delete('/:id', (req, res, next) => {
  if(!req.session.currentUser){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  Report.findById(req.params.id)
    .then(response => {
      if(response.hacker == req.session.currentUser._id){
        return Report.findByIdAndDelete(req.params.id)
          .then(()=>{return res.json('deleted')})
      }
      return res.status(401).json({
        error: 'unauthorized'
    })
    .catch(error => {console.log(error)});
  })
})

router.post('/', (req, res, next) => {
  const {
    title,
    website,
    description
  } = req.body;

  console.log(req.body)

  if(!req.session.currentUser){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  if(!title || !website || !description){
    return res.status(422).json({
      error: `Fields can't be empty`
    });
  }

  const newReport = Report({
    title,
    description,
    website,
    hacker: req.session.currentUser._id,
    status: 'open'
  })

  return newReport.save().then(() => {
    res.json(newReport);
  });
});

router.get('/',(req, res, next) => {  

  if(!req.session.currentUser){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  if(req.session.currentUser.type === 'hacker'){
    Report.find({hacker: req.session.currentUser._id })
      .then(response => {
        res.json(response);
      })
  }else{
    Website.find({owner: req.session.currentUser._id})
      .then(websites => {
        const reports = []
        async function asyncFun(callback){
          for(let i = 0; i < websites.length; i++){
            await Report.find({website: websites[i]._id})
              .then(response => {
               console.log(response)
               response.forEach((data)=>{
                reports.push(data)
               })
             })
          }
          callback()
        }
        asyncFun(()=>{
          res.json(reports);
        });  
      })
  }
});

router.patch('/:id', (req, res, next) => {
  if(!req.session.currentUser){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  const {newStatus} = req.body

  Report.findById(req.params.id)
    .then(response => {
      if(response.developer == req.session.currentUser._id){
        return Report.findByIdAndUpdate(req.params.id, { $set: { status: newStatus }})
          .then(()=>{return res.json('changed status')})
      }
      return res.status(401).json({
        error: 'unauthorized'
    })
    .catch(error => {console.log(error)});
  })
})


module.exports = router;
