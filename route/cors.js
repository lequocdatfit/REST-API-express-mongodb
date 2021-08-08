const express = require('express');
const cors = require('cors');

const whiteList = ['http://localhost:3000', 'https://localhost:3443'];

var corOptionsDelegate = (req, callback) => {
  var corsOptions;
  console.log(req.header('Origin'));
  if(whiteList.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false};
  }

  callback(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corOptionsDelegate);
