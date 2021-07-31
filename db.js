const mongoose = require('mongoose');
const Dishes = require('./model/dishes.model');
const Promotions = require('./model/promotions');
const leaders = require('./model/leaders');

const url = 'mongodb://localhost:27017/confusion';

mongoose.connect(url)
  .then(db => {
    console.log('connected correctly to mongodb');
  }).catch((err) => {
    console.log(err);
  })