const data = require('../utils/data');
const log = require('../utils/log');
const { CHARACTERS_COLLECTION } = require('../constants/collections');

const createCharacter = async character => {
  const newCharacter = await data.insertOne(CHARACTERS_COLLECTION, character);

  log.success(`Created new character ${newCharacter.name} (${newCharacter._id})`);

  return newCharacter;
};

const getPlayerCharacters = async (page, size, playerId) => {
  return await data.getSome(CHARACTERS_COLLECTION, page, size, 'createdBy', playerId);
};

const getGameCharacters = async (page, size, gameId) => {
  return await data.getSome(CHARACTERS_COLLECTION, page, size, 'gameId', gameId);
};

const getCharacter = async characterId => {
  return await data.getById(CHARACTERS_COLLECTION, characterId);
};

module.exports = {
  createCharacter,
  getPlayerCharacters,
  getGameCharacters,
  getCharacter
};
