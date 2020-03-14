const data = require('../utils/data');
const log = require('../utils/log');
const { pusher } = require('../utils/pusher');
const { UPDATE_GAME } = require('../constants/pusher');
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
  const updateLogs = await data.updateOne(DUNGEONS_COLLECTION, gameId, newLog);

  pusher.trigger(gameId, UPDATE_GAME, { ...newLog.messages });

  return {
    gameId,
    newLog,
    ...updateLogs
  };
};

module.exports = {
  createGame,
  getGame,
  addLog
};
