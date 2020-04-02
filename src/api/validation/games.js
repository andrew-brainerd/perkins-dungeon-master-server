const Joi = require('joi');

const postGameBody = Joi.object({
  name: Joi.string().required(),
  createdBy: Joi.string().required()
});

const defaultGameParams = Joi.object({
  gameId: Joi.string().required()
});

const putGameBody = Joi.object({
  message: Joi.object().required()
});

const getPlayerGamesQuery = Joi.object({
  pageNum: Joi.number(),
  pageSize: Joi.number(),
  playerId: Joi.string().required()
});

const getGamePlayersParams = Joi.object({
  gameId: Joi.string().required()
});

module.exports = {
  postGameBody,
  defaultGameParams,
  putGameBody,
  getPlayerGamesQuery,
  getGamePlayersParams
};
