const swagger = require('express').Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Perkins Dungeon Master API',
      version: '0.0.1',
      description: ''
    },
    servers: [
      {
        url: 'http://localhost:5000/api/'
      }
    ],
    apis: [
      './games.js'
    ]
  },
  apis: []
};

const specs = swaggerJsdoc(options);

swagger.use('/swagger', swaggerUi.serve);

swagger.get('/swagger', swaggerUi.setup(specs, { explorer: true }));

module.exports = swagger;
