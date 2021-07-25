const express = require('express');
const Dishes = require('../model/dishes.model');
const router = express.Router();

router.route('/')
.get((req, res, next) => {
  Dishes.find({})
    .then((dishes) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }).catch((err) => next(err));
})

.post((req, res, next) => {
  Dishes.create(req.body)
    .then((dishes) => {
      console.log('Dish Created ', dishes);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }).catch((err) => next(err));
})

.put((req, res, next) => {
  res.statusCode = 403;
  res.end('Put operation not supported on /dishes');
})

.delete((req, res, next) => {
  Dishes.remove({})
    .then((resp) => {
      console.log('Delete all dishes');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }).catch(err => next(err))
})

router.route('/:dishId')
.get((req, res, next) => {
  Dishes.findById(req.params.dishId)
    .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    }).catch(err => next(err))
})

.post((req, res, next) => {
  res.status = 403;
  res.end('Post operation not supported on /dishes/' + req.params.dishId);
})

.put((req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId, {
    $set: req.body
  }, {new: true})
  .then((dish) => {
    console.log('Updated ');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(dish);
  }).catch(err => next(err))
})


.delete((req, res, next) => {
  Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = router;