require('dotenv').config();
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const log = require('./utils/log');
const { validationErrorHandler } = require('./utils/validator');

const port = process.env.PORT || 5000;
const app = express();

const swaggerDefinition = {
  info: {
    title: 'Anorak API',
    version: '0.0.1',
    description: 'Server for Anorak Game Master'
  },
  host: 'localhost:5000',
  basePath: '/'
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./api/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', require('./api'));

app.use(validationErrorHandler);

app.listen(port, () => log.info(`Listening on port ${port}`));
