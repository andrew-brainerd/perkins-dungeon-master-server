const players = require('express').Router();
const playersData = require('../data/players');
const status = require('../utils/statusMessages');
const { validator } = require('../utils/validator');
const {
  postPlayerBody,
  defaultPlayerParams,
  getPlayerByEmailQuery,
  getCharactersQuery
} = require('./validation/players');

players.post('/', validator.body(postPlayerBody), async (req, res) => {
  const { body: { name, email } } = req;

  const newPlayer = await playersData.createPlayer({ name, email });
  if (!newPlayer) return status.serverError(res, 'Failed', `Failed to create character [${name}]`);

  return status.created(res, { ...newPlayer });
});

players.get('/email', validator.query(getPlayerByEmailQuery), async (req, res) => {
  const { query: { email } } = req;

  const player = await playersData.getPlayerByEmail(email);

  return status.success(res, { doesNotExist: !player, ...player });
});

players.get('/:playerId/characters',
  validator.params(defaultPlayerParams),
  validator.query(getCharactersQuery),
  async (req, res) => {
    const { params: { playerId }, query: { pageNum, pageSize } } = req;
    const page = parseInt(pageNum) || 1;
    const size = parseInt(pageSize) || 50;

    const { items, totalItems, totalPages } = await playersData.getPlayerCharacters(page, size, playerId);

    if (!items) return status.serverError(res, 'Failed', 'Failed to get player characters');

    return status.success(res, {
      items,
      pageNum: page,
      pageSize: size,
      totalItems,
      totalPages
    });
  });

module.exports = players;
