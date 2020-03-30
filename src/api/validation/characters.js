const Joi = require('joi');
const { characters: characterDefinitions } = require('gm-common');

const postCharacterBody = Joi.object({
  gameId: Joi.string().required(),
  playerId: Joi.string().required(),
  name: Joi.string().required(),
  class: Joi.string().valid(characterDefinitions.classTypes).required(),
  race: Joi.string().valid(characterDefinitions.raceTypes).required()
});

const getCharacterQuery = Joi.object({
  pageNum: Joi.number(),
  pageSize: Joi.number(),
  playerId: Joi.string()
});

module.exports = {
  postCharacterBody,
  getCharacterQuery
};
