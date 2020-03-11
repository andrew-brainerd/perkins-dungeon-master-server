const multiplayer = require('express').Router();
const { pusher } = require('../../utils/pusher');
const { isDefined } = require('../../utils/url');
const status = require('../../constants/statusMessages');
const { UPDATE_GAME } = require('../../constants/pusher');

multiplayer.post('/', async (req, res) => {
  const { query: { gameId }, body: { game } } = req;

  if (!isDefined(gameId)) return status.missingQueryParam(res, 'gameId');
  if (!game) return status.missingBodyParam(res, 'game');

  pusher.trigger(gameId, UPDATE_GAME, { ...game });

  return status.created(res, { message: `Pushed Game Update for ${gameId}`, game });
});

module.exports = multiplayer;
