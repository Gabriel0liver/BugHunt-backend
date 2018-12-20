const express = require('express');
const router = express.Router();

const Website = require('../models/website');
const Hacker = require('../models/hacker');
const Report = require('../models/report');
const Dev = require('../models/dev');

var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: process.env.GMAIL,
         pass: process.env.PASSWORD
     }
 });

router.get('/:id', (req, res, next) => {

  if(!req.session.currentUser){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  Report.findById(req.params.id)
  .then(response => {
    Website.findById(response.website)
      .then((website) => {
        Hacker.findById(response.hacker)
          .then((hacker => {
            const report = {
              title: response.title,
              description: response.description,
              website:  website.title,
              hacker: hacker.username,
              status: response.status,
              comment: response.comment
            }
            if(response.hacker == req.session.currentUser._id){
              return res.json(report)
            }else if(website.owner == req.session.currentUser._id){
              return res.json(report)
            }
            return res.status(401).json({
              error: 'unauthorized'
            });
          }))
      })
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


  if(req.session.currentUser.type !== 'hacker'){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  if(!title || !website || !description){
    return res.status(422).json({
      error: `Fields can't be empty`
    });
  }



  Hacker.findById(req.session.currentUser)
    .then((hacker)=>{
      const newReport = Report({
        title,
        description,
        website,
        hacker: req.session.currentUser._id,
        status: 'open',
        points: hacker.points
      })
      Website.findById(website)
        .then((response)=>{
          Dev.findById(response.owner)
            .then((developer)=>{
            return newReport.save().then(() => {
              const mailOptions = {
                from: 'bug-hunt-notifications@gmail.com', // sender address
                to: developer.email, // list of receivers
                subject: 'Opened report', // Subject line
                html: `<h4>The hacker ${req.session.currentUser.username} has opened a bug report for the website ${response.title}.</h4>
                <h4>Go to https://bug-hunt-website.firebaseapp.com/report/${newReport._id} to check it out</h4>`
              };
              transporter.sendMail(mailOptions, function (err, info) {if(err){console.log(err)}});
              res.json(newReport);
            });
            })
        })
    
      
    })

  
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

  const {newStatus, comment} = req.body

  Report.findById(req.params.id)
    .then(response => {
      Website.findById(response.website)
        .then((website) => {
          if(website.owner == req.session.currentUser._id && newStatus === 'open'){
            Hacker.findById(response.hacker)
            .then((hacker)=>{
              Hacker.findByIdAndUpdate(response.hacker, {$set: { points: hacker.points+1}})
                .then(()=>{
                  return Report.findByIdAndUpdate(req.params.id, { $set: { status: newStatus , comment}},)
                    .then((report)=>{
                      const mailOptions = {
                        from: 'bug-hunt-notifications@gmail.com', // sender address
                        to: hacker.email, // list of receivers
                        subject: 'Closed report', // Subject line
                        html: `<h4>The developer ${req.session.currentUser.username} has closed your report with the name ${report.title}.</h4>`
                      };
                      transporter.sendMail(mailOptions, function (err, info) {if(err){console.log(err)}});
                      return res.json('changed status')})
                })
            })
          }else if(website.owner == req.session.currentUser._id){
            return Report.findByIdAndUpdate(req.params.id, { $set: { status: newStatus , comment}},)
              .then(()=>{return res.json('changed status')})
            }
          return res.status(401).json({
            error: 'unauthorized'
          });
        })
    })
    .catch(error => {console.log(error)});
})


module.exports = router;
