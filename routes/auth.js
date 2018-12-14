const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Dev = require('../models/dev');
const Hacker = require('../models/hacker')

const { isLoggedIn } = require('../helpers/middlewares');

router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else {
    res.status(404).json({
      error: 'not-found'
    });
  }
});

router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).json({
      error: `Fields can't be empty`
    });
  }

  Dev.findOne({
      username
    })
    .then((user) => {
      if (!user) {
        Hacker.findOne({username})
          .then(user => {
            if(!user){
              return res.status(404).json({
                error: 'Invalid username or password'
              });
            }
            if (bcrypt.compareSync(password, user.password)) {
              req.session.currentUser = user;
              return res.status(200).json(user);
            }
            return res.status(404).json({
              error: 'Invalid username or password'
            });
          })
      }else{
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          return res.status(200).json(user);
        }
        return res.status(404).json({
          error: 'Invalid username or password'
        });
      }
      
    })
    .catch(next);
});


router.post('/signup', (req, res, next) => {
  const {
    username,
    password,
    type
  } = req.body;

  if (!username || !password) {
    return res.status(422).json({
      error: `Fields can't be empty.`
    });
  }

  if(type === 'hacker'){
    Hacker.findOne({
      username
    }, 'username')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({
          error: 'Username already taken'
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      let newHacker = Hacker({
        username,
        password: hashPass,
        type: 'hacker'
      });

      return newHacker.save().then(() => {
        req.session.currentUser = newHacker;
        res.json(newHacker);
      });
    })
    .catch(next);
  }else if(type === 'dev'){
    Dev.findOne({
      username
    }, 'username')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({
          error: 'Username already taken'
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newDev = Dev({
        username,
        password: hashPass,
        type: 'dev'
      });

      return newDev.save().then(() => {
        req.session.currentUser = newDev;
        res.json(newDev);
      });
    })
    .catch(next);
  }

  
});

router.post('/logout', (req, res) => {
  req.session.currentUser = null;
  return res.status(204).send();
});


module.exports = router;
