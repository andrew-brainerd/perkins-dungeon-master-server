const Joi = require('joi');
const games = require('express').Router();
const gamesData = require('../../data/games');
const status = require('../../constants/statusMessages');
const { UPDATE_GAME } = require('../../constants/pusher');
const { pusher } = require('../../utils/pusher');
const { validator } = require('../../utils/validator');

const postGameBody = Joi.object({
  name: Joi.string().required(),
  createdBy: Joi.object().required()
});

const defaultGameParams = Joi.object({
  gameId: Joi.string().required()
});

const putGameLogParams = Joi.object({
  gameId: Joi.string().required()
});

const putGameLogBody = Joi.object({
  logs: Joi.object().required()
});

const postCharacterBody = Joi.object({
  character: Joi.object().required()
}).keys({
  playerId: Joi.string().required(),
  name: Joi.string().required(),
  age: Joi.number().required(),
  height: Joi.string().required(),
  skinColor: Joi.string().required(),
  hairColor: Joi.string().required(),
  class: Joi.string().required(),
  level: Joi.number().required(),
  location: Joi.string().required(),
  race: Joi.string().required()
});

games.post('/', validator.body(postGameBody), async (req, res) => {
  const { body: { name, createdBy } } = req;

  const newGame = await gamesData.createGame(name, createdBy);
  if (!newGame) return status.serverError(res, 'Failed', `Failed to create game [${name}]`);

  return status.created(res, { ...newGame });
});

games.get('/:gameId', validator.params(defaultGameParams), async (req, res) => {
  const { params: { gameId } } = req;

  const game = await gamesData.getGame(gameId);
  return status.success(res, { ...game });
});

games.put('/:gameId/logs',
  validator.params(putGameLogParams),
  validator.body(putGameLogBody),
  async (req, res) => {
    const { params: { gameId }, body: { logs } } = req;

    const logsAdded = await gamesData.addLog(gameId, { logs });

    pusher.trigger(gameId, UPDATE_GAME, { ...logs });

    return status.success(res, { ...logsAdded });
  });

games.post('/:gameId/characters',
  validator.params(defaultGameParams),
  validator.body(postCharacterBody),
  async (req, res) => {
    const { params: { gameId }, body: { character } } = req;

    const newCharacter = await gamesData.createCharacter(gameId, character);
    if (!newCharacter) return status.serverError(
      res, 'Failed', `Failed to create character [${newCharacter.name}]`
    );

    return status.created(res, { ...newCharacter });
  });

module.exports = games;
