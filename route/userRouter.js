const e = require('express');
const express = require('express');
const Users = require('../model/users');
const router = express.Router();

router.post('/signup', (req, res, next) => {
  Users.findOne({ username: req.body.username })
    .then(user => {
      if(user) {
        console.log(user);
        const err = new Error('User ' + req.body.username + ' already exist.')
        err.status = 403;
        next(err);
      } else {
        Users.create({
          username: req.body.username,
          password: req.body.password
        }).then(user => {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({ status: 'Registration successful', user: user});
        }, err => next(err))
        .catch(err => next(err))
      }
    })
})

router.post('/login', (req, res, next) => {
  if(!req.session.user) {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
      const err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }

    const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const pass = auth[1];

    Users.findOne({ username: username})
      .then(user => {
        if(!user) {
          const err = new Error('User' + username + 'does not exist');
          err.status = 403;
          next(err);
        } else {
          if(user.password === pass) {
            req.session.user = user;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You are authenticated');
          } else {
            const err = new Error('Wrong password!');
            err.status = 403;
            next(err);
          }
        }
      }).catch(err => next(err))
  } else {
    res.status = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!')
    next(err);
  }
});

router.get('/logout', (req, res, next) => {
  console.log(req.session);
  if(req.session.user) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
})

module.exports = router;