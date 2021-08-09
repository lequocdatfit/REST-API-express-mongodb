const http = require('http');
const express=  require('express');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dishesRoute = require('./route/dishes.route');
const promoRoute = require('./route/promoRouter');
const leaderRoute = require('./route/leaderRouter');
const userRoute = require('./route/userRouter');
const uploadRoute = require('./route/uploadRouter');
const favoriteRoute = require('./route/favorite.route');
require('./authenticate/authenticate');
const Users = require('./model/users');

const app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if(req.secure) {
    return next();
  } else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
})

// connect mongodb
require('./db');

app.use(express.json());
//app.use(express.urlencoded({ extended: false}));
app.use(express.static('public'))


// Authentication Basic
// app.use((req, res, next) => {
//   console.log(req.headers);
//   const authHeader = req.headers.authorization;
//   if(!authHeader) {
//     const err = new Error('You are not authenticated');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     return next(err);
//   }

//   const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//   const user = auth[0];
//   const pass = auth[1];
//   if(user === 'admin' && pass === '12345') {
//     next();
//   } else {
//     const err = new Error('You are not authenticated');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     return next(err);
//   }
// })

// Cookie
// app.use(cookieParser('12312-3213123-23123-3213da-dadada2'));

// app.use((req, res, next) => {
//   console.log(req.headers);
//   if(!req.signedCookies.user) {
//     const authHeader = req.headers.authorization;
//     if(!authHeader) {
//       const err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 404;
//       return next(err);
//     }

//     const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     const user = auth[0];
//     const pass = auth[1];

//     if(user === 'admin' && pass === '12345') {
//       res.cookie('user', 'admin', { signed: true });
//       return next();
//     } else {
//       const err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 404;
//       return next(err);
//     }
//   } else {
//     if(req.signedCookies.user === 'admin') {
//       next();
//     } else {
//       const err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 404;
//       return next(err);
//     }
//   }
// }) 

app.use(session({
  name: 'session-id',
  secret: '1231321-213213-123123-12321',
  saveUninitialized: false,
  resave: false,
  store: new fileStore()
}))

app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body>Welcome</body></html>');
})

app.use('/users', userRoute);

// app.use((req, res, next) => {
//   console.log(req.headers);
//   if(!req.user) {
//     const authHeader = req.headers.authorization;
//     if(!authHeader) {
//       const err = new Error('You are not authenticated!');
//       err.status = 401;
//       return next(err);
//     }

//   } else {
//     next();
//   }
// }) 

app.use('/dishes', dishesRoute);

app.use('/promotions', promoRoute);

app.use('/leaders', leaderRoute);

app.use('/imageUpload', uploadRoute);

app.use('/favorites', favoriteRoute);

//errors handle
app.use(function (err, req, res, next) {
  console.log(err);
  res.statusCode = err.status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(err.stack);
})

module.exports = app;