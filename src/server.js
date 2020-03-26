require('dotenv').config();
const express = require('express');
const log = require('./utils/log');
const { validationErrorHandler } = require('./utils/validator');

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', require('./routes'));

app.use(validationErrorHandler);

app.listen(port, () => log.info(`Listening on port ${port}`));
