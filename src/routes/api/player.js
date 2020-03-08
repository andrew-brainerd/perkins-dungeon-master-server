const auth = require('../../utils/auth.js');
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
  await playerData.createPlayer(body);
  const token = auth.generateJWT(await playerData.getPlayerByEmail(body.email));
  return status.success(res, { token });
});

player.post('/login', async (req, res) => {
  const { body: { email, password} } = req;
  const loginInfo = await playerData.login(email, password);
  if (loginInfo) {
    return status.success(res, loginInfo);
  }

  return status.authError(res, email);
});

module.exports = player;
