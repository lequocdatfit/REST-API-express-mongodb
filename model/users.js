const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  facebookId: String,
  admin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.plugin(passportLocalMongoose);

const Users = mongoose.model('User', userSchema);

module.exports = Users;

