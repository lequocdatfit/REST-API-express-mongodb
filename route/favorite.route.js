const express = require('express');
const Favorites = require('../model/favorite');
const authenticate = require('../authenticate/authenticate');
const cors = require('./cors');
const router = express.Router();

router.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate('user dishes')
      .then(favorite => {
        console.log(favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
      }).catch(err => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(favorite => {
        const dishList = req.body.map(dish => {
          return dish._id;
        });

        let uniqueList = dishList.filter((item, index, array) => {
          return array.indexOf(item) === index;
        });
        // check if favorite document does not exist
        if(!favorite) {
          Favorites.create({
            user: req.user._id,
            dishes: uniqueList
          }).then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
          })
        } else {
          // use $addToSet Atomic operators
          Favorites.updateOne({ user: req.user._id }, 
            {$addToSet: { dishes: {$each : uniqueList} }}, { new: true})
            .then(favorite => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
        }
      }).catch(err => next(err));
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-type", "text/plain");
    res.end("Put operation not supported on /favorites")
  })
  .delete(cors.corsWithOptions , authenticate.verifyUser ,(req, res, next) => {
    Favorites.findOneAndRemove({ user: req.user._id })
      .then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      }).catch(err => next(err))
  })


router.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const dishId = req.params.dishId;
    
    Favorites.findOne({user: req.user._id})
      .then(favorite => {
        // check if favorite document does not exist
        if(!favorite) {
          Favorites.create({
            user: req.user._id,
            dishes: [dishId]
          }).then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
          }).catch(err => next(err))
        } else {
          // use $addToSet Atomic operators
          Favorites.updateOne({ user: req.user._id}, {$addToSet: { dishes: dishId }}, { new: true })
            .then(favorite => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            }).catch(err => next(err))
        }
      }).catch(err => next(err))
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const dishId = req.params.dishId;
    Favorites.updateOne({ user: req.user._id }, {$pull: {dishes: dishId}}, {new: true})
      .then(favorite => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      }).catch(err => next(err))
  })

module.exports = router;