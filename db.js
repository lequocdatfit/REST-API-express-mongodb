const mongoose = require('mongoose');
const Dishes = require('./model/dishes.model');
const Promotions = require('./model/promotions');
const leaders = require('./model/leaders');
const users = require('./model/users');
const Favorites = require('./model/favorite');
const config = require('./config');

//const url = 'mongodb://localhost:27017/confusion';

mongoose.connect(config.mongoUrl)
  .then(db => {
    console.log('connected correctly to mongodb');
  }).catch((err) => {
    console.log(err);
  })