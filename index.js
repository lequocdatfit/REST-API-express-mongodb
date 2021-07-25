const http = require('http');
const express=  require('express');
const dishesRoute = require('./route/dishes.route');
const host = 'localhost';
const port = 3000;

const app = express();

// connect mongodb
require('./db');

//app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/dishes', dishesRoute);

const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Server listening on port ${port}`);
});