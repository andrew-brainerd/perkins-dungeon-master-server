const data = require('../utils/data');
const log = require('../utils/log');
const { DUNGEONS_COLLECTION } = require('../constants/collections');

const createGame = async (name, createdBy) => {
  const newGame = await data.insertOne(
    DUNGEONS_COLLECTION, {
      name,
      createdBy,
      members: [createdBy]
    });

  log.success(`Created new game ${newGame.name} (${newGame._id})`);

  return newGame;
};

const getGame = async gameId => {
  return await data.getById(DUNGEONS_COLLECTION, gameId);
};

const addLog = async (gameId, newLog) => {
  return await data.updateOne(DUNGEONS_COLLECTION, gameId, newLog);
};

module.exports = {
  createGame,
  getGame,
  addLog
};
