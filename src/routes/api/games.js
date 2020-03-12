const games = require('express').Router();
const gamesData = require('../../data/games');
const status = require('../../constants/statusMessages');
const log = require('../../utils/log');
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

games.put('/:gameId/logs', async (req, res) => {
  const { params: { gameId }, body } = req;

  const logs = body.logs;

  log.cool('Adding log to game ', gameId, body);

  if (!isDefined(gameId)) return status.missingQueryParam(res, 'gameId');
  if (!logs) return status.missingBodyParam(res, 'logs');

  const logAdded = await gamesData.addLog(gameId, { logs });
  return status.success(res, { ...logAdded });
});

module.exports = games;
