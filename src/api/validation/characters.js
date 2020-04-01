const Joi = require('joi');
const { characters } = require('gm-common');

const postCharacterBody = Joi.object({
  gameId: Joi.string().required(),
  playerId: Joi.string().required(),
  name: Joi.string().required(),
  class: Joi.string().valid(characters.classTypes).required(),
  race: Joi.string().valid(characters.raceTypes).required(),
  order: Joi.string().valid(characters.alignments.orderTypes).required(),
  morality: Joi.string().valid(characters.alignments.moralityTypes).required()
});

const getGameCharactersQuery = Joi.object({
  pageNum: Joi.number(),
  pageSize: Joi.number(),
  gameId: Joi.string()
});

module.exports = {
  postCharacterBody,
  getGameCharactersQuery
};
