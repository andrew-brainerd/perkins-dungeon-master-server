const Joi = require('joi');
const games = require('express').Router();
const gamesData = require('../../data/games');
const status = require('../../constants/statusMessages');
const { validator } = require('../../utils/validator');

const postGameBody = Joi.object({
  name: Joi.string().required(),
  createdBy: Joi.string().required()
});

const getGameParams = Joi.object({
  gameId: Joi.string().required(),
});

games.post('/', validator.body(postGameBody), async (req, res) => {
  const { body: { name, createdBy } } = req;

  const newGame = await gamesData.createGame(name, createdBy);
  if (!newGame) return status.serverError(res, 'Failed', `Failed to create pod [${name}]`);

  return status.created(res, { ...newGame });
});

games.get('/:gameId', validator.params(getGameParams), async (req, res) => {
  const { params: { gameId } } = req;

  const game = await gamesData.getGame(gameId);
  return status.success(res, { ...game });
});

games.put('/:gameId/logs', async (req, res) => {
  const { params: { gameId }, body: { logs } } = req;

  if (!isDefined(gameId)) return status.missingQueryParam(res, 'gameId');
  if (!logs) return status.missingBodyParam(res, 'logs');

  const logAdded = await gamesData.addLog(gameId, { logs });
  return status.success(res, { ...logAdded });
});

module.exports = games;
