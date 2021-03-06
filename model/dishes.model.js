const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  comment: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
})

const dishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  price: {
    type: Currency,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    default:false      
  },
  comments : [commentSchema]
}, {
  timestamps: true,
  usePushEach: true
});

const Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;