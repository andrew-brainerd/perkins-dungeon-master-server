const Joi = require('joi');

const postPlayerBody = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required()
});

const defaultPlayerParams = Joi.object({
  playerId: Joi.string().required()
});

const getPlayerByEmailQuery = Joi.object({
  email: Joi.string()
});

const getCharactersQuery = Joi.object({
  pageNum: Joi.number(),
  pageSize: Joi.number()
});

module.exports = {
  postPlayerBody,
  defaultPlayerParams,
  getPlayerByEmailQuery,
  getCharactersQuery
};
