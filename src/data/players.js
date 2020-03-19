const data = require('../utils/data');
const log = require('../utils/log');
const { PLAYERS_COLLECTION } = require('../constants/collections');

const createPlayer = async player => {
  const newPlayer = await data.insertOne(PLAYERS_COLLECTION, player);

  log.success(`Created new player ${newPlayer.name} (${newPlayer._id})`);

  return newPlayer;
};

const getPlayerByEmail = async email => {
  return await data.getByProperty(PLAYERS_COLLECTION, 'email', email);
}

const getPlayerById = async playerId => {
  return await data.getById(PLAYERS_COLLECTION, playerId);
};

module.exports = {
  createPlayer,
  getPlayerByEmail,
  getPlayerById
};
