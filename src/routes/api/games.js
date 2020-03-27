const Joi = require('joi');
const games = require('express').Router();
const gamesData = require('../../data/games');
const status = require('../../utils/statusMessages');
const { validator } = require('../../utils/validator');

/**
 * @swagger
 * path:
 *   /games:
 *     get:
 *       summary: Get Game
 *       description: Returns an object describing the game
 *       tags:
 *         - animals
 *       parameters:
 *         - in: query
 *           name: gameId
 *           type: string
 *           required: true
 *       responses:
 *         200:
 *           description: Game Object
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: string
 *                 description: Game Identifier
 */

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

games.post('/', validator.body(postGameBody), async (req, res) => {
  const { body: { name, createdBy } } = req;

  const newGame = await gamesData.createGame(name, createdBy);
  if (!newGame) return status.serverError(res, 'Failed', `Failed to create pod [${name}]`);

  return status.created(res, { ...newGame });
});

const getPlayerGamesQuery = Joi.object({
  pageNum: Joi.number(),
  pageSize: Joi.number(),
  playerId: Joi.string().required()
});

games.get('/', validator.query(getPlayerGamesQuery), async (req, res) => {
  const { query: { pageNum, pageSize, playerId } } = req;
  const page = parseInt(pageNum) || 1;
  const size = parseInt(pageSize) || 50;

  const { items, totalItems, totalPages } = await gamesData.getGames(page, size, playerId);

  if (!items) return status.serverError(res, 'Failed', 'Failed to get player games');

  return status.success(res, {
    items,
    pageNum: page,
    pageSize: size,
    totalItems,
    totalPages
  });
});

games.get('/:gameId', validator.params(defaultGameParams), async (req, res) => {
  const { params: { gameId } } = req;

  const game = await gamesData.getGame(gameId);
  return status.success(res, { ...game });
});

games.put('/:gameId',
  validator.params(defaultGameParams),
  validator.body(putGameBody),
  async (req, res) => {
    const { params: { gameId }, body: { message } } = req;

    const logAdded = await gamesData.addLog(gameId, { messages: message });
    return status.success(res, { ...logAdded });
  });

module.exports = games;
