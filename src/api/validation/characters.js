const Joi = require('joi');
const { characters } = require('gm-common');

// Validation range is worst possible roll to best possible roll
const abilityScore = Joi.number().min(3).max(18);

const postCharacterBody = Joi.object({
  gameId: Joi.string().required(),
  playerId: Joi.string().required(),
  name: Joi.string().required(),
  class: Joi.string().valid(characters.classTypes).required(),
  race: Joi.string().valid(characters.raceTypes).required(),
  order: Joi.string().valid(characters.alignments.orderTypes).required(),
  morality: Joi.string().valid(characters.alignments.moralityTypes).required(),
  abilityScores: Joi.object({
    strength: abilityScore.required(),
    dexterity: abilityScore.required(),
    constitution: abilityScore.required(),
    intelligence: abilityScore.required(),
    wisdom: abilityScore.required(),
    charisma: abilityScore.required()
  }).required()
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
