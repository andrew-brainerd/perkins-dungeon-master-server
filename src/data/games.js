const data = require('../utils/data');
const log = require('../utils/log');
const { GAMES_COLLECTION, CHARACTERS_COLLECTION } = require('../constants/collections');

const createGame = async (name, createdBy) => {
  const newGame = await data.insertOne(
    GAMES_COLLECTION, {
    name,
    createdBy,
    members: [createdBy]
  });

  log.success(`Created new game ${newGame.name} (${newGame._id})`);

  return newGame;
};

const getGame = async gameId => {
  return await data.getById(GAMES_COLLECTION, gameId);
};

const addLog = async (gameId, newLog) => {
  return await data.updateOne(GAMES_COLLECTION, gameId, newLog);
};

const createCharacter = async (gameId, character) => {
  const newCharacter = await data.insertOne(
    CHARACTERS_COLLECTION, {
    gameId,
    ...character
  });

  log.success(`Created new character ${newCharacter.name} (${newCharacter._id})`);

  return newCharacter;
};

module.exports = {
  createGame,
  getGame,
  addLog,
  createCharacter
};
