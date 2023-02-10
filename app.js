require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/limiter');
const DEV_ADDRESS = require('./utils/config');

const { PORT = 3000, NODE_ENV, DB_ADDRESS } = process.env;

const allowedCors = [
  'http://filmopoisk.trus.nomoredomainsclub.ru',
  'https://filmopoisk.trus.nomoredomainsclub.ru',
];

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

app.use(limiter);

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : DEV_ADDRESS, {
  useNewUrlParser: true,
});

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
