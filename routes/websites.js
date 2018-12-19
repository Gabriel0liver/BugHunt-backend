const express = require('express');
const router = express.Router();

const Hacker = require('../models/hacker');
const Dev = require('../models/dev');
const Website = require('../models/website');

const { isLoggedIn } = require('../helpers/middlewares');

router.get('/:id', (req, res, next) => {

  if(!req.session.currentUser){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  Website.findById(req.params.id)
		.then(response => {
				Dev.findById(response.owner)
						.then(developer => {
							const website = {
								title: response.title,
								url: response.url,
								owner: developer.owner
								}
							return res.json(website) 
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

  Website.findById(req.params.id)
    .then(response => {
      if(response.owner == req.session.currentUser._id){
        return Website.findByIdAndDelete(req.params.id)
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
    url
  } = req.body;

  if(!req.session.currentUser || req.session.currentUser.type !== 'dev'){
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  if(!title || !url){
    return res.status(422).json({
      error: `Fields can't be empty`
    });
  }

	const newWebsite = Website({
		title,
		url,
		owner: req.session.currentUser._id
  })

	return newWebsite.save().then(() => {
		res.json(newWebsite);
	});
});
	
router.get('/',(req, res, next) => {
  if(req.session.currentUser.type === 'hacker'){
  Website.find()
		.then(response => {
			response.map(website => {
				return {
          title: website.title,
          id: website._id
        }
      })
      res.json(response);
    })
  }else if(req.session.currentUser.type === 'dev'){
    Website.find({owner: req.session.currentUser._id})
		.then(response => {
			response.map(website => {
				return {
          title: website.title,
          id: website._id
        }
      })
      res.json(response);
    })
  }
			
});


module.exports = router;