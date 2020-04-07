const characters = require('express').Router();
const charactersData = require('../data/characters');
const status = require('../utils/statusMessages');
const { validator } = require('../utils/validator');
const { postCharacterBody, getGameCharactersQuery } = require('./validation/characters');

characters.post('/', validator.body(postCharacterBody), async (req, res) => {
  const { body: { ...attributes } } = req;

  const character = {
    ...attributes,
    level: 1,
    background: 'Acolyte',
    location: 'startLocationGuid',
    experiencePoints: 0,
    remainingSpells: 3,
    inventory: [],
  };

  const newCharacter = await charactersData.createCharacter(character);
  if (!newCharacter) return status.serverError(res, 'Failed', `Failed to create character [${character.name}]`);

  return status.created(res, { ...newCharacter });
});

characters.get('/', validator.query(getGameCharactersQuery), async (req, res) => {
  const { query: { pageNum, pageSize, gameId } } = req;
  const page = parseInt(pageNum) || 1;
  const size = parseInt(pageSize) || 50;

  const { items, totalItems, totalPages } = await charactersData.getGameCharacters(page, size, gameId);

  if (!items) return status.serverError(res, 'Failed', 'Failed to get game characters');

  return status.success(res, {
    items,
    pageNum: page,
    pageSize: size,
    totalItems,
    totalPages
  });
});

module.exports = characters;
