const _ = require('lodash');
const auth = require('../../utils/auth.js');
const middleware = require('../middleware.js');
const player = require('express').Router();
const playerData = require('../../data/players.js');
const status = require('../../constants/statusMessages');

// TODO: Post body validation
player.post('/', async (req, res) => {
  const { body } = req;
  const maybeExistingPlayer = await playerData.getPlayerByEmail(body.email);
  if (maybeExistingPlayer) {
    return status.alreadyExists(res, 'player', 'email', body.email);
  }

  const newPlayer = await playerData.createPlayer(body);

  return status.success(res, {
    token: auth.generateJWT(newPlayer),
    player: _.pick(newPlayer, '_id', 'email', 'characters'),
  });
});

player.post('/login', async (req, res) => {
  const { body: { email, password} } = req;
  const loginInfo = await playerData.login(email, password);
  if (loginInfo) {
    return status.success(res, loginInfo);
  }

  return status.authError(res, email);
});

player.post('/character', middleware.authPlayerMiddleware, async (req, res) => {
  const { body } = req;
  const newCharacter = { ...body, playerId: req.player._id };
  await playerData.createCharacter(newCharacter);
  return status.success(res);
});

player.get('/characters', middleware.authPlayerMiddleware, async (req, res) => {
  return status.success(res, await playerData.getCharactersForPlayer(req.player._id));
});

module.exports = player;
