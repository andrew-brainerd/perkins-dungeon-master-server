const Joi = require('joi');
const characters = require('express').Router();
const charactersData = require('../../data/characters');
const status = require('../../constants/statusMessages');
const { validator } = require('../../utils/validator');

const postCharacterBody = Joi.object({
  gameId: Joi.string().required(),
  name: Joi.string().required(),
  createdBy: Joi.string().required()
});

characters.post('/', validator.body(postCharacterBody), async (req, res) => {
  const { body: { gameId, name, createdBy } } = req;

  const newCharacter = await charactersData.createCharacter({ gameId, name, createdBy });
  if (!newCharacter) return status.serverError(res, 'Failed', `Failed to create character [${name}]`);

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
