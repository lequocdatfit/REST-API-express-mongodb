const express = require('express');
const Leaders = require('../model/leaders');
const authenticate = require('../authenticate/authenticate');
const cors = require('./cors');
const router = express.Router();

router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, (req, res, next) => {
    Leaders.find({})
      .then(leaders => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
      }).catch(err => next(err))
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
      .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
      }).catch(err => next(err))
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /leaders');
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
      .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }).catch(err => next(err))
  })

router.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
      }).catch(err => next(err))
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported on /leaders/' + req.params.leaderId);
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
      $set: req.body
    }, {new : true})
      .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
      }).catch(err => next(err))
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }).catch(err => next(err))
  })

module.exports = router;