const data = require('../utils/data');
const log = require('../utils/log');
const { pusher } = require('../utils/pusher');
const { UPDATE_GAME } = require('../constants/pusher');
const { DUNGEONS_COLLECTION } = require('../constants/collections');
const { parseUserInput } = require('../utils/game');

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

const addLog = async (gameId, message) => {
  const serverResponse = parseUserInput(message);
  const appendUserMessage = await data.updateOne(DUNGEONS_COLLECTION, gameId, message);
  const appendServerMessage = await data.updateOne(DUNGEONS_COLLECTION, gameId, serverResponse);

  pusher.trigger(gameId, UPDATE_GAME, { appendUserMessage, appendServerMessage });

  console.log('Response: %o', serverResponse);

  return {
    gameId,
    userMessage: message,
    userMessageStatus: appendUserMessage,
    serverMessageStatus: appendServerMessage
  };
};

module.exports = {
  createGame,
  getGame,
  addLog
};
