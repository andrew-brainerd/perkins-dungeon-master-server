const Joi = require('joi');
const characters = require('express').Router();
const { characterConstants } = require('gm-common');
const charactersData = require('../../data/characters');
const status = require('../../utils/statusMessages');
const { validator } = require('../../utils/validator');

const postCharacterBody = Joi.object({
  gameId: Joi.string().required(),
  playerId: Joi.string().required(),
  name: Joi.string().required(),
  class: Joi.string().valid(characterConstants.classTypes).required(),
  race: Joi.string().valid(characterConstants.raceTypes).required()
});

console.log('Class Types: %o', characterConstants.classTypes);
console.log('Race Types: %o', characterConstants.raceTypes);

characters.post('/', validator.body(postCharacterBody), async (req, res) => {
  const { body: { createdBy, ...attributes } } = req;

  const character = {
    ...attributes,
    level: 1,
    background: 'Acolyte',
    location: 'startLocationGuid',
    playerId: createdBy,
    experiencePoints: 0,
    remainingSpells: 3
  };

  const newCharacter = await charactersData.createCharacter(character);
  if (!newCharacter) return status.serverError(res, 'Failed', `Failed to create character [${character.name}]`);

  return status.created(res, { ...newCharacter });
});

const getCharacterQuery = Joi.object({
  pageNum: Joi.number(),
  pageSize: Joi.number(),
  playerId: Joi.string()
});

characters.get('/', validator.query(getCharacterQuery), async (req, res) => {
  const { query: { pageNum, pageSize, playerId } } = req;
  const page = parseInt(pageNum) || 1;
  const size = parseInt(pageSize) || 50;

  const { items, totalItems, totalPages } = await charactersData.getPlayerCharacters(page, size, playerId);
  
  if (!items) return status.serverError(res, 'Failed', 'Failed to get player characters');

  return status.success(res, {
    items,
    pageNum: page,
    pageSize: size,
    totalItems,
    totalPages
  });
});

module.exports = characters;
