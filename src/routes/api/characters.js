const Joi = require('joi');
const characters = require('express').Router();
const charactersData = require('../../data/characters');
const status = require('../../constants/statusMessages');
const { validator } = require('../../utils/validator');

const postCharacterBody = Joi.object({
  name: Joi.string().required(),
  createdBy: Joi.string().required(),
  gameId: Joi.string().required()
});

const defaultCharacterParams = Joi.object({
  gameId: Joi.string().required()
});

characters.post('/', validator.body(postCharacterBody), async (req, res) => {
  const { body: { name, createdBy } } = req;

  const newCharacter = await charactersData.createCharacter({ name, createdBy });
  if (!newCharacter) return status.serverError(res, 'Failed', `Failed to create character [${name}]`);

  return status.created(res, { ...newCharacter });
});

const getCharacterQuery = Joi.object({
  pageNum: Joi.number(),
  pageSize: Joi.number(),
  userEmail: Joi.string()
});

characters.get('/', validator.query(getCharacterQuery), async (req, res) => {
  const { query: { pageNum, pageSize, userEmail } } = req;
  const page = parseInt(pageNum) || 1;
  const size = parseInt(pageSize) || 50;

  const { items, totalItems, totalPages } = await charactersData.getUserCharacters(page, size, userEmail);
  
  if (!items) return status.serverError(res, 'Failed', 'Failed to get user characters');

  return status.success(res, {
    items,
    pageNum: page,
    pageSize: size,
    totalItems,
    totalPages
  });
});

characters.get('/:characterId', validator.params(defaultCharacterParams), async (req, res) => {
  const { params: { gameId } } = req;

  const game = await charactersData.getGameCharacters(gameId);
  return status.success(res, { ...game });
});

module.exports = characters;
