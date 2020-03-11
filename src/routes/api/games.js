const games = require('express').Router();
const gamesData = require('../../data/games');
const status = require('../../constants/statusMessages');
const { isDefined } = require('../../utils/url');

games.post('/', async (req, res) => {
  const { body: { name, createdBy } } = req;

  if (!name) return status.missingBodyParam(res, 'name');
  if (!createdBy) return status.missingBodyParam(res, 'createdBy');

  const newGame = await gamesData.createGame(name, createdBy);
  if (!newGame) return status.serverError(res, 'Failed', `Failed to create pod [${name}]`);

  return status.created(res, { ...newGame });
});

games.get('/:gameId', async (req, res) => {
  const { params: { gameId } } = req;

  if (!isDefined(gameId)) return status.missingQueryParam(res, 'gameId');

  const game = await gamesData.getGame(gameId);
  return status.success(res, { ...game });
});

module.exports = games;
