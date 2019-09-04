const express = require('express');
const { apiRoutes } = require('./routes');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const redis = require('async-redis');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 9000;
const REDIS_URL = process.env.REDIS_URL || 6379;

const app = express();
const client = redis.createClient(REDIS_URL);
global.client = client;

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', err => {
  console.log('Error:', err);
});

// All environments
app.set('port', PORT);
app.use(cors());
app.use(morgan('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

//Dev environment
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

module.exports = app;
