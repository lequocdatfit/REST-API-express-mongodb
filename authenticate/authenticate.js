const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const Users = require('../model/users');
const config = require('../config');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const facebookTokenStrategy = require('passport-facebook-token');


passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  console.log('JWT payload', jwt_payload);
  Users.findOne({ _id: jwt_payload._id }, (err, user) => {
    if(err) {
      return done(err, false);
    } else if(user) {
      return done(null, user);
    } else {
      done(null, false);
    }
  })
}))

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
  if(req.user.admin === true) {
    next();
  } else {
    const err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  }
}

exports.facebookPassport = passport.use(new 
  facebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
  },
  (accessToken, refreshToken, profile, done) => {
    Users.findOne({ facebookId: profile.id }, (err, user) => {
      if(err) {
        return done(err, false);
      }
      if(!err & user !== null) {
        return done(null, user);
      } else {
        user = new Users({ username: profile.displayName});
        user.facebookId = profile.id;
        user.firstName = profile.name.givenName;
        user.lastName = profile.name.familyName;
        user.save((err, user) => {
          if(err) {
            return done(err, false);
          } else {
            return done(null, user);
          }
        });

      }
    })
  }
))


