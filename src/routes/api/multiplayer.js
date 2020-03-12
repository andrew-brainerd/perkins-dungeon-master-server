const Joi = require('joi');
const multiplayer = require('express').Router();
const { pusher } = require('../../utils/pusher');
const status = require('../../constants/statusMessages');
const { UPDATE_GAME } = require('../../constants/pusher');
const { validator } = require('../../utils/validator');

const postMultiplayerQuery = Joi.object({
  gameId: Joi.string().required(),
});

const postMultiplayerBody = Joi.object({
  game: Joi.object().required(),
});

multiplayer.post('/', validator.query(postMultiplayerQuery), validator.body(postMultiplayerBody), async (req, res) => {
  const { query: { gameId }, body: { game } } = req;

  pusher.trigger(gameId, UPDATE_GAME, { ...game });

  return status.created(res, { message: `Pushed Game Update for ${gameId}`, game });
});

module.exports = multiplayer;
